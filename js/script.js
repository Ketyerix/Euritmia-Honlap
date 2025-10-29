// Közös funkcionalitás minden oldalhoz

// Navigáció – szinkronizálja a statikus és sticky gombokat
function setActiveButton(page) {
    const staticButtons = document.querySelectorAll('.static-nav .nav-button');
    const stickyButtons = document.querySelectorAll('.sticky-nav .nav-button');

    staticButtons.forEach(btn => btn.classList.remove('active'));
    stickyButtons.forEach(btn => btn.classList.remove('active'));

    staticButtons.forEach(btn => {
        if (btn.dataset.page === page) btn.classList.add('active');
    });
    stickyButtons.forEach(btn => {
        if (btn.dataset.page === page) btn.classList.add('active');
    });
}

// Sticky navigáció kezelése - optimalizált változat
function initStickyNav() {
    const staticHeader = document.getElementById('staticHeader');
    const stickyNav = document.getElementById('stickyNav');
    
    if (!staticHeader || !stickyNav) return;

    let ticking = false;

    function updateStickyNav() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 50) {
            stickyNav.classList.add('visible');
            staticHeader.style.opacity = '0';
            staticHeader.style.pointerEvents = 'none';
        } else {
            stickyNav.classList.remove('visible');
            staticHeader.style.opacity = '1';
            staticHeader.style.pointerEvents = 'auto';
        }
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateStickyNav);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
}

// Scroll to top funkció
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Oldal betöltésekor inicializálás
document.addEventListener('DOMContentLoaded', function() {
    initStickyNav();
    
    // Navigációs gombok eseménykezelői
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', () => {
            const page = button.dataset.page;
            setActiveButton(page);
        });
    });
});