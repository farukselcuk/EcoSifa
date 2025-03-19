// Veri Depolama
let bitkiVerileri = JSON.parse(localStorage.getItem('bitkiVerileri')) || [
    {
        id: 1,
        name: "Nane",
        type: "herb",
        image: "images/nane.jpg",
        benefits: "Baş ağrısını hafifletir, sindirime yardımcı olur.",
        usage: "Günde 2-3 fincan çay olarak tüketilebilir.",
        preparation: "1 tatlı kaşığı kuru nane 1 bardak kaynar suda 5-10 dk demlenir.",
        warnings: "Mide rahatsızlığı olanlar dikkatli kullanmalı.",
        conditions: ["headache", "digestion"],
        dosage: "Günde maksimum 3 fincan"
    },
    {
        id: 2,
        name: "Papatya ve Lavanta Karışımı",
        type: "mix",
        image: "images/papatya-lavanta.jpg",
        benefits: "Sakinleştirir, uykusuzluk ve strese iyi gelir.",
        usage: "Yatmadan önce 1 fincan içilir.",
        preparation: "1’er çay kaşığı papatya ve lavanta 10 dk demlenir.",
        warnings: "Alerjik reaksiyonlara dikkat edin.",
        conditions: ["insomnia", "stress", "anxiety"],
        dosage: "Günde 1-2 fincan"
    },
    {
        id: 3,
        name: "Zencefil",
        type: "herb",
        image: "images/zencefil.jpg",
        benefits: "Öksürüğü hafifletir, bağışıklığı güçlendirir.",
        usage: "Günde 2-3 fincan çay olarak tüketilir.",
        preparation: "1 çay kaşığı rendelenmiş zencefil 10 dk kaynatılır.",
        warnings: "Yüksek dozda mide yanmasına neden olabilir.",
        conditions: ["cough", "digestion"],
        dosage: "Günde 3 fincan"
    }
];

// Veri Kaydetme
function verileriKaydet() {
    localStorage.setItem('bitkiVerileri', JSON.stringify(bitkiVerileri));
}

// Sayfa Geçişleri
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

// Tedavi Önerileri
function showSuggestions() {
    const disease = document.getElementById('disease').value;
    const treatmentTypes = Array.from(document.querySelectorAll('input[name="treatment-type"]:checked')).map(type => type.value);

    if (!disease || treatmentTypes.length === 0) {
        alert("Lütfen bir rahatsızlık ve tedavi türü seçin.");
        return;
    }

    const suggestions = getSmartSuggestions(disease, treatmentTypes);
    const resultDiv = document.getElementById('results');
    
    if (suggestions.length > 0) {
        resultDiv.innerHTML = suggestions.map(item => `
            <div class="suggestion-card">
                <div class="suggestion-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='images/default-herb.jpg'">
                </div>
                <div class="suggestion-content">
                    <h3><i class="fas ${item.type === 'herb' ? 'fa-leaf' : 'fa-mortar-pestle'}"></i> ${item.name}</h3>
                    <p><strong>Faydaları:</strong> ${item.benefits}</p>
                    <p><strong>Hazırlama:</strong> ${item.preparation || item.usage}</p>
                    <p><strong>Uyarılar:</strong> ${item.warnings || 'Doktora danışın.'}</p>
                    <button onclick="showPage('database'); highlightHerb(${item.id})" class="view-details-button">
                        <i class="fas fa-info-circle"></i> Detayları Gör
                    </button>
                </div>
            </div>
        `).join('');
    } else {
        resultDiv.innerHTML = `
            <div class="no-result">
                <i class="fas fa-exclamation-circle"></i>
                <p>Seçiminize uygun bir tedavi bulunamadı.</p>
                <p>Veritabanında daha fazla bitki keşfedin!</p>
            </div>
        `;
    }
}

function getSmartSuggestions(disease, types) {
    const filteredHerbs = bitkiVerileri.filter(bitki => 
        bitki.conditions.includes(disease) && types.includes(bitki.type)
    );

    if (filteredHerbs.length > 1 && types.includes('mix')) {
        const combo = {
            id: Date.now(),
            name: `${filteredHerbs[0].name} ve ${filteredHerbs[1].name} Karışımı`,
            type: 'mix',
            image: filteredHerbs[0].image,
            benefits: `${filteredHerbs[0].benefits} ve ${filteredHerbs[1].benefits}`,
            preparation: 'Her birinden 1 tatlı kaşığı alarak 10 dakika demleyin.',
            conditions: [disease],
            warnings: 'Aşırı tüketimden kaçının.'
        };
        filteredHerbs.push(combo);
    }

    return filteredHerbs.slice(0, 3);
}

// Bitki Vurgulama
function highlightHerb(herbId) {
    setTimeout(() => {
        const herbElement = document.querySelector(`.herb-item[data-id="${herbId}"]`);
        if (herbElement) {
            herbElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            herbElement.classList.add('highlighted');
            setTimeout(() => herbElement.classList.remove('highlighted'), 3000);
        }
    }, 100);
}

// Arama
document.getElementById('herbSearch').addEventListener('input', debounce(function(e) {
    const filteredHerbs = searchHerbs(e.target.value);
    currentPage = 1;
    bitkiListesiniGoster(filteredHerbs);
}, 300));

function searchHerbs(searchTerm) {
    return bitkiVerileri.filter(bitki => {
        const fields = [bitki.name, bitki.benefits, bitki.usage].map(f => f.toLowerCase());
        return searchTerm.toLowerCase().split(' ').every(term => fields.some(f => f.includes(term)));
    });
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Sayfalama
let currentPage = 1;
const itemsPerPage = 6;

function bitkiListesiniGoster(herbs = bitkiVerileri) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedHerbs = herbs.slice(startIndex, endIndex);
    
    const herbsList = document.querySelector('.herbs-list');
    herbsList.innerHTML = paginatedHerbs.map(bitki => `
        <div class="herb-item" data-id="${bitki.id}">
            <div class="herb-image" onclick="showImageModal('${bitki.image}', '${bitki.name}')">
                <img src="${bitki.image}" alt="${bitki.name}" onerror="this.src='images/default-herb.jpg'">
                <div class="herb-overlay"><i class="fas fa-search-plus"></i></div>
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
                    <button onclick="editHerb(${bitki.id})" class="edit-button"><i class="fas fa-edit"></i> Düzenle</button>
                    <button onclick="deleteHerb(${bitki.id})" class="delete-button"><i class="fas fa-trash"></i> Sil</button>
                </div>
            </div>
        </div>
    `).join('');

    updatePagination(herbs.length);
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageNumbers = document.querySelector('.page-numbers');
    pageNumbers.innerHTML = Array.from({ length: totalPages }, (_, i) => `
        <div class="page-number ${i + 1 === currentPage ? 'active' : ''}" onclick="goToPage(${i + 1})">${i + 1}</div>
    `).join('');

    document.querySelector('.pagination-button:first-child').disabled = currentPage === 1;
    document.querySelector('.pagination-button:last-child').disabled = currentPage === totalPages;
}

function changePage(direction) {
    const totalPages = Math.ceil(bitkiVerileri.length / itemsPerPage);
    if (direction === 'prev' && currentPage > 1) currentPage--;
    if (direction === 'next' && currentPage < totalPages) currentPage++;
    bitkiListesiniGoster();
}

function goToPage(page) {
    currentPage = page;
    bitkiListesiniGoster();
}

// Bitki Düzenleme ve Ekleme
document.getElementById('newHerbForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const herbData = {
        name: document.getElementById('herbName').value,
        image: document.getElementById('herbImage').value || 'images/default-herb.jpg',
        benefits: document.getElementById('herbBenefits').value,
        usage: document.getElementById('herbUsage').value,
        conditions: Array.from(document.querySelectorAll('input[name="conditions"]:checked')).map(input => input.value),
        type: document.querySelector('input[name="herbType"]:checked').value
    };

    if (!herbData.name || !herbData.benefits || !herbData.usage) {
        alert("Lütfen tüm zorunlu alanları doldurun.");
        return;
    }

    if (this.dataset.editId) {
        const id = parseInt(this.dataset.editId);
        const index = bitkiVerileri.findIndex(b => b.id === id);
        bitkiVerileri[index] = { ...bitkiVerileri[index], ...herbData };
        delete this.dataset.editId;
        document.querySelector('.add-herb-form h3').innerHTML = '<i class="fas fa-plus-circle"></i> Yeni Bitki Ekle';
        document.querySelector('.add-herb-form button[type="submit"]').innerHTML = '<i class="fas fa-plus"></i> Bitki Ekle';
    } else {
        herbData.id = bitkiVerileri.length ? Math.max(...bitkiVerileri.map(b => b.id)) + 1 : 1;
        bitkiVerileri.push(herbData);
    }

    verileriKaydet();
    bitkiListesiniGoster();
    this.reset();
    toggleForm();
});

function editHerb(id) {
    const herb = bitkiVerileri.find(b => b.id === id);
    document.getElementById('herbName').value = herb.name;
    document.getElementById('herbBenefits').value = herb.benefits;
    document.getElementById('herbUsage').value = herb.usage;
    document.getElementById('herbImage').value = herb.image;
    document.querySelector(`input[name="herbType"][value="${herb.type}"]`).checked = true;
    herb.conditions.forEach(condition => {
        document.querySelector(`input[name="conditions"][value="${condition}"]`).checked = true;
    });

    document.querySelector('.add-herb-form h3').innerHTML = `<i class="fas fa-edit"></i> Düzenle: ${herb.name}`;
    document.querySelector('.add-herb-form button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Güncelle';
    document.getElementById('newHerbForm').dataset.editId = id;
    document.querySelector('.add-herb-form').scrollIntoView({ behavior: 'smooth' });
    document.querySelector('.add-herb-form').style.display = 'block';
    setTimeout(() => document.querySelector('.add-herb-form').classList.add('show'), 10);
}

function deleteHerb(id) {
    if (confirm('Bu bitkiyi silmek istediğinize emin misiniz?')) {
        bitkiVerileri = bitkiVerileri.filter(b => b.id !== id);
        verileriKaydet();
        bitkiListesiniGoster();
    }
}

// Form Göster/Gizle
function toggleForm() {
    const form = document.querySelector('.add-herb-form');
    const button = document.getElementById('showAddHerbForm');
    if (form.classList.contains('show')) {
        form.classList.remove('show');
        setTimeout(() => form.style.display = 'none', 300);
        button.innerHTML = '<i class="fas fa-plus-circle"></i> Yeni Bitki Ekle';
    } else {
        form.style.display = 'block';
        setTimeout(() => form.classList.add('show'), 10);
        button.innerHTML = '<i class="fas fa-minus-circle"></i> Formu Gizle';
    }
}

document.getElementById('showAddHerbForm').addEventListener('click', toggleForm);

// Tür Filtreleme
function filterByType(type) {
    const filteredHerbs = bitkiVerileri.filter(b => b.type === type);
    currentPage = 1;
    bitkiListesiniGoster(filteredHerbs);
}

// Modal
function showImageModal(imageSrc, caption) {
    const modal = document.getElementById('imageModal');
    document.getElementById('modalImage').src = imageSrc;
    document.getElementById('modalCaption').innerHTML = caption;
    modal.style.display = 'block';
}

document.querySelector('.modal-close').onclick = () => document.getElementById('imageModal').style.display = 'none';
window.onclick = e => { if (e.target === document.getElementById('imageModal')) document.getElementById('imageModal').style.display = 'none'; };

// Sayfa Yüklenmesi
document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
    bitkiListesiniGoster();
});