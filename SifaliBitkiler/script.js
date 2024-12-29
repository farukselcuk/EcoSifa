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

// Sayfa Yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
});
