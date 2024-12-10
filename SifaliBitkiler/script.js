// Sayfa Geçişlerini Yönetmek için JavaScript
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

// Öneri Al Butonu için İşlev
function showSuggestions() {
    const disease = document.getElementById('disease').value;
    const treatmentTypes = document.querySelectorAll('input[name="treatment-type"]:checked');
    let selectedTypes = [];
    treatmentTypes.forEach(type => selectedTypes.push(type.value));

    if (selectedTypes.length === 0) {
        alert("Lütfen en az bir tedavi türü seçin.");
        return;
    }

    let suggestions = "";
    if (disease === "headache") {
        if (selectedTypes.includes("herb")) {
            suggestions += `
                <p><strong>- Nane Çayı:</strong> Baş ağrısını hafifletebilir. 
                <br><em>Kullanım:</em> Günde 2 defa, yemeklerden sonra içilmesi önerilir.</p>`;
        }
        if (selectedTypes.includes("mix")) {
            suggestions += `
                <p><strong>- Ballı Papatya Karışımı:</strong> Rahatlama sağlayabilir.
                <br><em>Kullanım:</em> Sabah ve akşam birer çay kaşığı tüketebilirsiniz.</p>`;
        }
    } else if (disease === "cough") {
        if (selectedTypes.includes("herb")) {
            suggestions += `
                <p><strong>- Zencefil Çayı:</strong> Öksürüğü hafifletebilir.
                <br><em>Kullanım:</em> Günde 3 fincan, sıcak olarak içebilirsiniz.</p>`;
        }
        if (selectedTypes.includes("mix")) {
            suggestions += `
                <p><strong>- Bal ve Limon Karışımı:</strong> Boğazı yatıştırır.
                <br><em>Kullanım:</em> Bir çay kaşığı karışımı ılık suya ekleyip için. Günde 2 kez uygulanabilir.</p>`;
        }
    } else if (disease === "fatigue") {
        if (selectedTypes.includes("herb")) {
            suggestions += `
                <p><strong>- Yeşil Çay:</strong> Enerji seviyesini artırabilir.
                <br><em>Kullanım:</em> Sabah ve öğlen birer fincan içebilirsiniz.</p>`;
        }
        if (selectedTypes.includes("mix")) {
            suggestions += `
                <p><strong>- Bal ve Tarçın Karışımı:</strong> Enerji verebilir.
                <br><em>Kullanım:</em> Kahvaltı öncesi ve yatmadan önce birer çay kaşığı tüketebilirsiniz.</p>`;
        }
    }

    const resultDiv = document.getElementById('results');
    if (suggestions) {
        resultDiv.innerHTML = suggestions;
    } else {
        resultDiv.innerHTML = "<p>Seçimlerinize uygun öneri bulunamadı.</p>";
    }
}

// Varsayılan Sayfa
document.addEventListener('DOMContentLoaded', () => {
    showPage('home'); // Ana sayfa açılışta görünsün
});
