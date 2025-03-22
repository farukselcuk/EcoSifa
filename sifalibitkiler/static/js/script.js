// Modal İşlemleri
function showModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
}

function closeModal(modalId) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    if (modal) {
        modal.hide();
    }
}

// Modal dışına tıklandığında kapatma
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
});

// Arama İşlevi
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.trim();
        if (query.length >= 2) {
            fetch(`/search/?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    updateSearchResults(data);
                })
                .catch(error => console.error('Arama hatası:', error));
        } else {
            document.getElementById('searchResults').innerHTML = '';
        }
    }, 300));
}

// Arama Sonuçlarını Güncelleme
function updateSearchResults(data) {
    const resultsContainer = document.getElementById('searchResults');
    if (data.length === 0) {
        resultsContainer.innerHTML = '<div class="p-3">Sonuç bulunamadı</div>';
        return;
    }

    const resultsList = document.createElement('div');
    resultsList.className = 'list-group';
    
    data.forEach(item => {
        const resultItem = document.createElement('a');
        resultItem.href = item.url;
        resultItem.className = 'list-group-item list-group-item-action';
        resultItem.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${item.image}" alt="${item.name}" class="me-3" style="width: 50px; height: 50px; object-fit: cover;">
                <div>
                    <h6 class="mb-0">${item.name}</h6>
                    <small class="text-muted">${item.type}</small>
                </div>
            </div>
        `;
        resultsList.appendChild(resultItem);
    });

    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(resultsList);
}

// Debounce Fonksiyonu
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Form Doğrulama
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', function(event) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('is-invalid');
            } else {
                field.classList.remove('is-invalid');
            }
        });

        if (!isValid) {
            event.preventDefault();
            alert('Lütfen tüm zorunlu alanları doldurun.');
        }
    });
});

// Sayfa Geçişleri
document.addEventListener('DOMContentLoaded', function() {
    // Sayfa yüklendiğinde yumuşak geçiş efekti
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);

    // Bitki vurgulama
    const urlParams = new URLSearchParams(window.location.search);
    const highlightId = urlParams.get('highlight');
    if (highlightId) {
        const element = document.getElementById(highlightId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('highlight');
            setTimeout(() => {
                element.classList.remove('highlight');
            }, 2000);
        }
    }
});

// Silme İşlemi Onayı
function confirmDelete(event) {
    if (!confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
        event.preventDefault();
    }
}

// Form Temizleme
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        const invalidFields = form.querySelectorAll('.is-invalid');
        invalidFields.forEach(field => {
            field.classList.remove('is-invalid');
        });
    }
}

// Sayfa Yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Tooltip'leri etkinleştir
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Popover'ları etkinleştir
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}); 