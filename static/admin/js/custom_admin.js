document.addEventListener('DOMContentLoaded', function() {
    // Tablo satırlarına hover efekti
    const tableRows = document.querySelectorAll('#result_list tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(46, 125, 50, 0.05)';
        });
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });

    // Form alanlarına focus efekti
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#2E7D32';
            this.style.boxShadow = '0 0 0 3px rgba(46, 125, 50, 0.1)';
        });
        input.addEventListener('blur', function() {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        });
    });

    // Butonlara hover efekti
    const buttons = document.querySelectorAll('.button, input[type=submit], input[type=button], .submit-row input, a.button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // Yan menü aktif link vurgusu
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('#nav-sidebar a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.style.backgroundColor = 'rgba(46, 125, 50, 0.1)';
            link.style.color = '#2E7D32';
        }
    });

    // Mesaj animasyonları
    const messages = document.querySelectorAll('.messagelist li');
    messages.forEach(message => {
        message.style.opacity = '0';
        message.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            message.style.transition = 'all 0.3s ease';
            message.style.opacity = '1';
            message.style.transform = 'translateY(0)';
        }, 100);
    });

    // Responsive menü toggle
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    document.querySelector('#header').appendChild(menuToggle);

    menuToggle.addEventListener('click', function() {
        const sidebar = document.querySelector('#nav-sidebar');
        sidebar.classList.toggle('show');
    });
}); 