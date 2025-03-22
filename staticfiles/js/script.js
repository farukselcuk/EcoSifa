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
        const query = this.value;
        if (query.length >= 2) {
            fetch(`/api/search/?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    updateSearchResults(data);
                })
                .catch(error => console.error('Error:', error));
        } else {
            document.getElementById('searchResults').innerHTML = '';
        }
    }, 300));
}

// Arama Sonuçlarını Güncelleme
function updateSearchResults(data) {
    const resultsDiv = document.getElementById('searchResults');
    if (data.length === 0) {
        resultsDiv.innerHTML = '<div class="alert alert-info">Sonuç bulunamadı.</div>';
        return;
    }

    let html = '<div class="list-group">';
    data.forEach(bitki => {
        html += `
            <a href="/bitkiler/${bitki.id}/" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${bitki.isim}</h5>
                    <small>${bitki.tip}</small>
                </div>
                <p class="mb-1">${bitki.faydalar.substring(0, 100)}...</p>
            </a>
        `;
    });
    html += '</div>';
    resultsDiv.innerHTML = html;
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
    form.addEventListener('submit', function(e) {
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
            e.preventDefault();
            alert('Lütfen tüm zorunlu alanları doldurun.');
        }
    });
});

// Sayfa Geçişleri
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});

// Bitki Vurgulama
function highlightBitki(bitkiId) {
    const bitkiElement = document.getElementById(`bitki-${bitkiId}`);
    if (bitkiElement) {
        bitkiElement.classList.add('highlight');
        setTimeout(() => {
            bitkiElement.classList.remove('highlight');
        }, 2000);
    }
}

// Silme Onayı
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