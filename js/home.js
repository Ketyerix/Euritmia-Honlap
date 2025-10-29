// Kezdőlap specifikus JavaScript - Karusszel, Galéria, Modal
document.addEventListener('DOMContentLoaded', function() {
    // Karusszel funkcionalitás
    initCarousel();
    
    // Galéria funkcionalitás
    initGallery();
    
    // Modal funkcionalitás
    initModal();
});

// Karusszel inicializálása
function initCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    
    if (!items.length || !prevButton || !nextButton) return;
    
    let currentIndex = 0;
    let carouselInterval;

    function showItem(index) {
        items.forEach((item, i) => {
            item.classList.remove('active');
            if (dots[i]) dots[i].classList.remove('active');
        });
        items[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        currentIndex = index;
    }

    function nextItem() {
        currentIndex = (currentIndex + 1) % items.length;
        showItem(currentIndex);
    }

    function prevItem() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showItem(currentIndex);
    }

    // Eseménykezelők
    prevButton.addEventListener('click', prevItem);
    nextButton.addEventListener('click', nextItem);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showItem(index);
        });
    });

    // Automatikus váltás
    function startAutoPlay() {
        carouselInterval = setInterval(nextItem, 4000);
    }

    function stopAutoPlay() {
        clearInterval(carouselInterval);
    }

    // Auto-play indítása
    startAutoPlay();

    // Auto-play szüneteltetése interakció esetén
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
        
        // Touch események mobilon
        carouselContainer.addEventListener('touchstart', stopAutoPlay);
        carouselContainer.addEventListener('touchend', startAutoPlay);
    }
}

// Galéria inicializálása
function initGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    const galleryPrev = document.querySelector('.gallery-prev');
    const galleryNext = document.querySelector('.gallery-next');
    
    if (!galleryContainer || !galleryWrapper || !galleryPrev || !galleryNext) return;

    let galleryCurrentIndex = 0;
    const itemWidth = 250;
    const gap = 10;

    // Számold ki, hány oszlop fér el a látható területen
    function getVisibleColumns() {
        const containerWidth = galleryContainer.clientWidth;
        return Math.floor(containerWidth / (itemWidth + gap));
    }

    // Számold ki, hány oszlop van összesen
    function getTotalColumns() {
        return Math.ceil(galleryWrapper.scrollWidth / (itemWidth + gap));
    }

    function updateGalleryPosition() {
        const translateX = -galleryCurrentIndex * (itemWidth + gap);
        galleryWrapper.style.transform = `translateX(${translateX}px)`;
    }

    function nextGallery() {
        const totalColumns = getTotalColumns();
        const visibleColumns = getVisibleColumns();
        const maxIndex = Math.max(0, totalColumns - visibleColumns);

        if (galleryCurrentIndex < maxIndex) {
            galleryCurrentIndex++;
            updateGalleryPosition();
        }
    }

    function prevGallery() {
        if (galleryCurrentIndex > 0) {
            galleryCurrentIndex--;
            updateGalleryPosition();
        }
    }

    // Eseménykezelők
    galleryPrev.addEventListener('click', prevGallery);
    galleryNext.addEventListener('click', nextGallery);

    // Resize esemény kezelése
    function updateGalleryOnResize() {
        const totalColumns = getTotalColumns();
        const visibleColumns = getVisibleColumns();
        const maxIndex = Math.max(0, totalColumns - visibleColumns);

        if (galleryCurrentIndex > maxIndex) {
            galleryCurrentIndex = maxIndex;
            updateGalleryPosition();
        }
    }

    window.addEventListener('resize', updateGalleryOnResize);
    
    // Touch swipe támogatás mobilon
    let touchStartX = 0;
    let touchEndX = 0;
    
    galleryContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    galleryContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextGallery(); // Balra swipe - következő
            } else {
                prevGallery(); // Jobbra swipe - előző
            }
        }
    }
}

// Modal inicializálása
function initModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    
    if (!modal || !modalImg) return;

    let currentImageSet = [];
    let currentImageIndex = 0;

    // Modal megnyitása
    function openModal(imageSrc, imageAlt, imageSet, imageIndex) {
        if (!modal || !modalImg) return;
        
        modal.style.display = 'flex';
        modalImg.src = imageSrc;
        modalImg.alt = imageAlt;
        currentImageSet = imageSet;
        currentImageIndex = imageIndex;
        
        // Testreszabás: ne engedje a görgetést modal nyitva
        document.body.style.overflow = 'hidden';
    }

    // Modal bezárása
    function closeModal() {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Következő kép a modalban
    function nextModalImage() {
        if (currentImageSet.length === 0) return;
        currentImageIndex = (currentImageIndex + 1) % currentImageSet.length;
        const nextImage = currentImageSet[currentImageIndex];
        modalImg.src = nextImage.src;
        modalImg.alt = nextImage.alt;
    }

    // Előző kép a modalban
    function prevModalImage() {
        if (currentImageSet.length === 0) return;
        currentImageIndex = (currentImageIndex - 1 + currentImageSet.length) % currentImageSet.length;
        const prevImage = currentImageSet[currentImageIndex];
        modalImg.src = prevImage.src;
        modalImg.alt = prevImage.alt;
    }

    // Eseménykezelők
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalPrev) {
        modalPrev.addEventListener('click', prevModalImage);
    }
    
    if (modalNext) {
        modalNext.addEventListener('click', nextModalImage);
    }

    // Modal bezárása kívülre kattintva
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ESC billentyűvel is bezárható
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
        // Balra/Jobbra nyilak a modal navigációhoz
        if (modal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                prevModalImage();
            } else if (e.key === 'ArrowRight') {
                nextModalImage();
            }
        }
    });

    // Karusszel képek eseménykezelői
    const carouselImages = document.querySelectorAll('.carousel-item img');
    carouselImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            openModal(this.src, this.alt, Array.from(carouselImages), index);
        });
    });

    // Galéria képek eseménykezelői
    const galleryImages = document.querySelectorAll('.gallery-item');
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            openModal(this.src, this.alt, Array.from(galleryImages), index);
        });
    });
}