// Sayfa Geçişleri
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

// Önerileri Göster
function showSuggestions() {
    const disease = document.getElementById('disease').value;
    const treatmentTypes = document.querySelectorAll('input[name="treatment-type"]:checked');
    let selectedTypes = [];
    treatmentTypes.forEach(type => selectedTypes.push(type.value));

    if (!disease) {
        alert("Lütfen bir rahatsızlık seçin.");
        return;
    }

    if (selectedTypes.length === 0) {
        alert("Lütfen en az bir tedavi türü seçin.");
        return;
    }

    // Seçilen rahatsızlık ve türe göre bitkileri filtrele
    const filteredHerbs = bitkiVerileri.filter(bitki => 
        bitki.conditions.includes(disease) && 
        selectedTypes.includes(bitki.type)
    );

    const resultDiv = document.getElementById('results');
    
    if (filteredHerbs.length > 0) {
        resultDiv.innerHTML = filteredHerbs.map(bitki => `
            <div class="suggestion-card">
                <div class="suggestion-image">
                    <img src="${bitki.image}" alt="${bitki.name}">
                </div>
                <div class="suggestion-content">
                    <h3>${bitki.name}</h3>
                    <p><strong>Faydaları:</strong> ${bitki.benefits}</p>
                    <p><strong>Kullanım:</strong> ${bitki.usage}</p>
                    <button onclick="showPage('database'); highlightHerb(${bitki.id})" class="view-details-button">
                        <i class="fas fa-info-circle"></i> Detayları Gör
                    </button>
                </div>
            </div>
        `).join('');
    } else {
        resultDiv.innerHTML = `
            <div class="no-result">
                <i class="fas fa-exclamation-circle"></i>
                <p>Seçimlerinize uygun öneri bulunamadı.</p>
                <p>Farklı bir seçim yapmayı deneyebilir veya veritabanını inceleyebilirsiniz.</p>
            </div>
        `;
    }
}

// Önerilen bitkiyi vurgulama fonksiyonu
function highlightHerb(herbId) {
    setTimeout(() => {
        const herbElement = document.querySelector(`.herb-item[data-id="${herbId}"]`);
        if (herbElement) {
            herbElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            herbElement.classList.add('highlighted');
            setTimeout(() => {
                herbElement.classList.remove('highlighted');
            }, 3000);
        }
    }, 100);
}

// Gelişmiş arama fonksiyonu
function searchHerbs(searchTerm) {
    return bitkiVerileri.filter(bitki => {
        const searchFields = [
            bitki.name,
            bitki.benefits,
            bitki.usage
        ].map(field => field.toLowerCase());
        
        const terms = searchTerm.toLowerCase().split(' ');
        
        return terms.every(term => 
            searchFields.some(field => field.includes(term))
        );
    });
}

// Arama olayını güncelle
document.getElementById('herbSearch').addEventListener('input', debounce(function(e) {
    const searchTerm = e.target.value;
    const filteredHerbs = searchHerbs(searchTerm);
    bitkiListesiniGoster(filteredHerbs);
}, 300));

// Debounce fonksiyonu
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Başlangıç verilerini güncelleyelim
let bitkiVerileri = JSON.parse(localStorage.getItem('bitkiVerileri')) || [
    {
        id: 1,
        name: "Nane",
        type: "herb",
        image: "images/nane.jpg",
        benefits: "Baş ağrısını hafifletir, sindirime yardımcı olur, ferahlatıcı etkisi vardır.",
        usage: "Günde 2-3 fincan çay olarak tüketilebilir.",
        conditions: ["headache", "digestion"]
    },
    {
        id: 2,
        name: "Papatya ve Lavanta Karışımı",
        type: "mix",
        image: "images/papatya-lavanta.jpg",
        benefits: "Sakinleştirici etkisi bulunur. Uykusuzluğa ve strese iyi gelir.",
        usage: "Yatmadan önce 1 fincan içilebilir.",
        conditions: ["insomnia", "stress", "anxiety"]
    },
    {
        id: 3,
        name: "Zencefil",
        type: "herb",
        image: "images/zencefil.jpg",
        benefits: "Öksürüğü hafifletir, bağışıklığı güçlendirir, sindirime yardımcı olur.",
        usage: "Günde 2-3 fincan çay olarak veya karışımlarda kullanılabilir.",
        conditions: ["cough", "digestion", "joint_pain"]
    },
    {
        id: 4,
        name: "Melisa",
        type: "herb",
        image: "images/melisa.jpg",
        benefits: "Stres ve kaygıyı azaltır, uykuya yardımcı olur.",
        usage: "Günde 2-3 fincan içilebilir.",
        conditions: ["stress", "anxiety", "insomnia"]
    },
    {
        id: 5,
        name: "Zerdeçal",
        type: "herb",
        image: "images/zerdecal.jpg",
        benefits: "Güçlü antiinflamatuar etkisi vardır, eklem ağrılarını hafifletir.",
        usage: "Günde 2 fincan çay olarak veya karışımlarda kullanılabilir.",
        conditions: ["joint_pain"]
    },
    {
        id: 6,
        name: "Ömer Faruk Karışımı",
        type: "mix",
        image: "images/default-herb.jpg",
        benefits: "Stres ve kaygıyı azaltır, rahatlatıcı etki sağlar.",
        usage: "Günde 2 fincan içilebilir.",
        conditions: ["stress", "anxiety"]
    }
];

// LocalStorage'ı temizleyip yeni verileri kaydedelim
localStorage.removeItem('bitkiVerileri');
localStorage.setItem('bitkiVerileri', JSON.stringify(bitkiVerileri));

// Verileri localStorage'a kaydetme fonksiyonu
function verileriKaydet() {
    localStorage.setItem('bitkiVerileri', JSON.stringify(bitkiVerileri));
}

// Bitkileri görüntüleme fonksiyonunu güncelle
function bitkiListesiniGoster(herbs = bitkiVerileri) {
    const herbsList = document.querySelector('.herbs-list');
    herbsList.innerHTML = herbs.map(bitki => `
        <div class="herb-item" data-id="${bitki.id}">
            <div class="herb-image" onclick="showImageModal('${bitki.image}', '${bitki.name}')">
                <img src="${bitki.image}" alt="${bitki.name}">
                <div class="herb-overlay">
                    <i class="fas fa-search-plus"></i>
                </div>
                <div class="herb-type ${bitki.type}">
                    <i class="fas ${bitki.type === 'herb' ? 'fa-leaf' : 'fa-mortar-pestle'}"></i>
                    ${bitki.type === 'herb' ? 'Tekli Bitki' : 'Karışım'}
                </div>
            </div>
            <div class="herb-info">
                <h3><i class="fas fa-seedling"></i> ${bitki.name}</h3>
                <div class="herb-properties">
                    <span><i class="fas fa-star"></i> Özellikler</span>
                    <p>${bitki.benefits}</p>
                </div>
                <div class="herb-usage">
                    <span><i class="fas fa-mortar-pestle"></i> Kullanım</span>
                    <p>${bitki.usage}</p>
                </div>
                <div class="herb-conditions">
                    <span><i class="fas fa-heartbeat"></i> İlgili Rahatsızlıklar</span>
                    <div class="condition-tags">
                        ${(bitki.conditions || []).map(condition => `
                            <span class="condition-tag" onclick="filterByCondition('${condition}')">
                                ${getConditionName(condition)}
                            </span>
                        `).join('')}
                    </div>
                </div>
                <div class="herb-actions">
                    <button onclick="editHerb(${bitki.id})" class="edit-button">
                        <i class="fas fa-edit"></i> Düzenle
                    </button>
                    <button onclick="deleteHerb(${bitki.id})" class="delete-button">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Rahatsızlık isimlerini getiren yardımcı fonksiyon
function getConditionName(conditionKey) {
    const conditionNames = {
        headache: "Baş Ağrısı",
        cough: "Öksürük",
        insomnia: "Uykusuzluk",
        stress: "Stres",
        digestion: "Sindirim",
        joint_pain: "Eklem Ağrısı",
        allergy: "Alerji",
        anxiety: "Kaygı"
    };
    return conditionNames[conditionKey] || conditionKey;
}

// Rahatsızlığa göre filtreleme
function filterByCondition(condition) {
    const filteredHerbs = bitkiVerileri.filter(bitki => 
        bitki.conditions.includes(condition)
    );
    bitkiListesiniGoster(filteredHerbs);
}

// Form doğrulama fonksiyonu
function validateHerbForm(herbData) {
    const errors = [];
    
    if (!herbData.name.trim()) {
        errors.push("Bitki adı boş olamaz");
    }
    
    if (!herbData.benefits.trim()) {
        errors.push("Faydaları alanı boş olamaz");
    }
    
    if (!herbData.usage.trim()) {
        errors.push("Kullanım alanı boş olamaz");
    }
    
    return errors;
}

// Resim URL doğrulama
function isValidImageUrl(url) {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}

// XSS koruması
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Form gönderimini güncelle
document.getElementById('newHerbForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const herbData = {
        name: sanitizeInput(document.getElementById('herbName').value),
        image: document.getElementById('herbImage').value || 'images/default-herb.jpg',
        benefits: document.getElementById('herbBenefits').value,
        usage: document.getElementById('herbUsage').value,
        conditions: Array.from(document.querySelectorAll('input[name="conditions"]:checked')).map(input => input.value),
        type: document.querySelector('input[name="herbType"]:checked').value
    };

    const errors = validateHerbForm(herbData);
    if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
    }

    if (this.dataset.editId) {
        // Güncelleme modu
        const id = parseInt(this.dataset.editId);
        const index = bitkiVerileri.findIndex(bitki => bitki.id === id);
        if (index !== -1) {
            bitkiVerileri[index] = { 
                ...bitkiVerileri[index], 
                ...herbData,
                image: herbData.image || bitkiVerileri[index].image
            };
        }
        
        // Formu ekleme moduna geri döndür
        delete this.dataset.editId;
        document.querySelector('.add-herb-form h3').innerHTML = `
            <i class="fas fa-plus-circle"></i> Yeni Bitki Ekle
        `;
        document.querySelector('.add-herb-form button[type="submit"]').innerHTML = `
            <i class="fas fa-plus"></i> Bitki Ekle
        `;
    } else {
        // Yeni bitki ekleme modu
        const yeniBitki = {
            id: bitkiVerileri.length > 0 ? Math.max(...bitkiVerileri.map(b => b.id)) + 1 : 1,
            ...herbData
        };
        bitkiVerileri.push(yeniBitki);
    }

    verileriKaydet();
    bitkiListesiniGoster();
    this.reset();
});

// Bitki düzenleme fonksiyonu
function editHerb(id) {
    const herb = bitkiVerileri.find(bitki => bitki.id === id);
    if (!herb) return;

    // Form alanlarını doldur
    document.getElementById('herbName').value = herb.name;
    document.getElementById('herbBenefits').value = herb.benefits;
    document.getElementById('herbUsage').value = herb.usage;
    document.getElementById('herbImage').value = herb.image;

    // Form başlığını güncelle
    document.querySelector('.add-herb-form h3').innerHTML = `
        <i class="fas fa-edit"></i> Bitki Düzenle: ${herb.name}
    `;

    // Form butonunu güncelle
    const submitButton = document.querySelector('.add-herb-form button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Güncelle';
    
    // Form gönderimini güncelleme moduna al
    const form = document.getElementById('newHerbForm');
    form.dataset.editId = id;
    
    // Forma scroll
    document.querySelector('.add-herb-form').scrollIntoView({ behavior: 'smooth' });
}

// Bitki silme fonksiyonu
function deleteHerb(id) {
    if (confirm('Bu bitkiyi silmek istediğinizden emin misiniz?')) {
        bitkiVerileri = bitkiVerileri.filter(bitki => bitki.id !== id);
        verileriKaydet(); // Değişiklikleri localStorage'a kaydet
        bitkiListesiniGoster();
    }
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // LocalStorage'ı temizle ve varsayılan verileri yükle
    localStorage.clear();
    
    // Varsayılan verileri tanımla
    const defaultHerbs = [
        {
            id: 1,
            name: "Nane",
            type: "herb",
            image: "images/nane.jpg",
            benefits: "Baş ağrısını hafifletir, sindirime yardımcı olur, ferahlatıcı etkisi vardır.",
            usage: "Günde 2-3 fincan çay olarak tüketilebilir.",
            conditions: ["headache", "digestion"]
        },
        {
            id: 2,
            name: "Papatya ve Lavanta Karışımı",
            type: "mix",
            image: "images/papatya-lavanta.jpg",
            benefits: "Sakinleştirici etkisi bulunur. Uykusuzluğa ve strese iyi gelir.",
            usage: "Yatmadan önce 1 fincan içilebilir.",
            conditions: ["insomnia", "stress", "anxiety"]
        },
        {
            id: 3,
            name: "Ömer Faruk Karışımı",
            type: "mix",
            image: "images/default-herb.jpg",
            benefits: "Stres ve kaygıyı azaltır, rahatlatıcı etki sağlar.",
            usage: "Günde 2 fincan içilebilir.",
            conditions: ["stress", "anxiety"]
        }
    ];

    // Varsayılan verileri localStorage'a kaydet
    localStorage.setItem('bitkiVerileri', JSON.stringify(defaultHerbs));
    
    // Global bitkiVerileri değişkenini güncelle
    bitkiVerileri = defaultHerbs;
    
    // Ana sayfayı göster ve bitkileri listele
    showPage('home');
    bitkiListesiniGoster();
});

// Modal işlevselliği için yeni fonksiyonlar
function showImageModal(imageSrc, caption) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    modal.style.display = "block";
    modalImg.src = imageSrc;
    modalCaption.innerHTML = caption;
}

// Modal kapatma işlevselliği
document.querySelector('.modal-close').onclick = function() {
    document.getElementById('imageModal').style.display = "none";
}

// Modal dışına tıklandığında kapatma
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// ESC tuşu ile modalı kapatma
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        document.getElementById('imageModal').style.display = "none";
    }
});

// Sayfa yüklendiğinde resimleri önbelleğe al
function preloadImages() {
    bitkiVerileri.forEach(bitki => {
        const img = new Image();
        img.src = bitki.image;
    });
}

// LocalStorage işlemlerini optimize et
const storage = {
    save: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },
    load: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    }
};

// Tür filtreleme fonksiyonu ekleyelim
function filterByType(type) {
    const filteredHerbs = bitkiVerileri.filter(bitki => bitki.type === type);
    bitkiListesiniGoster(filteredHerbs);
}
