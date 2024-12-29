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

    let suggestions = "";
    const treatments = {
        headache: {
            herb: {
                name: "Nane Çayı",
                usage: "Günde 2-3 fincan içilebilir.",
                effect: "Baş ağrısını hafifletir ve ferahlık sağlar."
            },
            mix: {
                name: "Lavanta ve Papatya Karışımı",
                usage: "Günde 2 fincan içilebilir.",
                effect: "Ağrıyı dindirir ve rahatlatıcı etki sağlar."
            }
        },
        cough: {
            herb: {
                name: "Zencefil Çayı",
                usage: "Günde 3 fincan içilebilir.",
                effect: "Öksürüğü hafifletir ve bağışıklığı güçlendirir."
            },
            mix: {
                name: "Bal ve Zerdeçal Karışımı",
                usage: "Günde 2 kez bir tatlı kaşığı.",
                effect: "Boğaz ağrısını dindirir ve öksürüğü azaltır."
            }
        },
        // Diğer hastalıklar için öneriler eklenebilir
    };

    if (treatments[disease]) {
        selectedTypes.forEach(type => {
            if (treatments[disease][type]) {
                const treatment = treatments[disease][type];
                suggestions += `
                    <p>
                        <strong>${treatment.name}</strong><br>
                        <em>Kullanım:</em> ${treatment.usage}<br>
                        <em>Etki:</em> ${treatment.effect}
                    </p>
                `;
            }
        });
    }

    const resultDiv = document.getElementById('results');
    if (suggestions) {
        resultDiv.innerHTML = suggestions;
    } else {
        resultDiv.innerHTML = "<p>Seçimlerinize uygun öneri bulunamadı.</p>";
    }
}

// Bitki arama fonksiyonu
document.getElementById('herbSearch').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const herbs = document.querySelectorAll('.herb-item');
    
    herbs.forEach(herb => {
        const herbName = herb.querySelector('h3').textContent.toLowerCase();
        const herbProperties = herb.querySelector('.herb-properties p').textContent.toLowerCase();
        
        if (herbName.includes(searchTerm) || herbProperties.includes(searchTerm)) {
            herb.style.display = '';
        } else {
            herb.style.display = 'none';
        }
    });
});

// Başlangıç verilerini localStorage'dan al veya varsayılan verileri kullan
let bitkiVerileri = JSON.parse(localStorage.getItem('bitkiVerileri')) || [
    {
        id: 1,
        name: "Isırgan Otu",
        image: "images/isirgan.jpg",
        benefits: "Kan temizleyici özelliği vardır. Bağışıklık sistemini güçlendirir.",
        usage: "Günde 2-3 fincan çay olarak tüketilebilir."
    },
    {
        id: 2,
        name: "Papatya",
        image: "images/papatya.jpg",
        benefits: "Sakinleştirici etkisi bulunur. Uykusuzluğa iyi gelir.",
        usage: "Yatmadan önce 1 fincan içilebilir."
    },
    {
        id: 3,
        name: "Adaçayı",
        image: "images/adacayi.jpg",
        benefits: "Boğaz ağrısına iyi gelir. Antiseptik özelliği vardır.",
        usage: "Günde 2 kez ılık olarak içilebilir."
    }
];

// Verileri localStorage'a kaydetme fonksiyonu
function verileriKaydet() {
    localStorage.setItem('bitkiVerileri', JSON.stringify(bitkiVerileri));
}

// Bitkileri görüntüleme fonksiyonunu güncelle
function bitkiListesiniGoster() {
    const herbsList = document.querySelector('.herbs-list');
    herbsList.innerHTML = bitkiVerileri.map(bitki => `
        <div class="herb-item">
            <div class="herb-image" onclick="showImageModal('${bitki.image}', '${bitki.name}')">
                <img src="${bitki.image}" alt="${bitki.name}">
                <div class="herb-overlay">
                    <i class="fas fa-search-plus"></i>
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

// Yeni bitki ekleme
document.getElementById('newHerbForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const herbData = {
        name: document.getElementById('herbName').value,
        image: document.getElementById('herbImage').value,
        benefits: document.getElementById('herbBenefits').value,
        usage: document.getElementById('herbUsage').value
    };

    if (this.dataset.editId) {
        // Güncelleme modu
        const id = parseInt(this.dataset.editId);
        const index = bitkiVerileri.findIndex(bitki => bitki.id === id);
        if (index !== -1) {
            bitkiVerileri[index] = { ...bitkiVerileri[index], ...herbData };
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

    verileriKaydet(); // Değişiklikleri localStorage'a kaydet
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
    showPage('home');
    bitkiListesiniGoster(); // JSON yükleme kaldırıldı, direkt array kullanılıyor
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
