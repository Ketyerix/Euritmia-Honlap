// Kezdőlap specifikus JavaScript - Karusszel, Galéria, Modal
document.addEventListener('DOMContentLoaded', function() {
    // Karusszel funkcionalitás
    initCarousel();
    
    // Galéria funkcionalitás
    initGallery();
    
    // Modal funkcionalitás
    initModal();
});

// === Cikkek dinamikus megjelenítése ===

function updateArticlesLayout() {
    const grid = document.getElementById('articlesGrid');
    if (!grid) return;

    // Számoljuk meg a látható teljes cikkeket (display: block)
    const visibleFullArticles = Array.from(grid.querySelectorAll('.article-full')).filter(el => {
        return window.getComputedStyle(el).display === 'block';
    });

    if (visibleFullArticles.length > 0) {
        grid.classList.add('expanded');
    } else {
        grid.classList.remove('expanded');
    }
}

// Globális függvények – a HTML onclick attribútumok számára
window.showFullArticle = function(articleId) {
    const fullArticle = document.getElementById(articleId);
    if (!fullArticle) return;

    const articleCard = fullArticle.previousElementSibling;
    if (!articleCard) return;

    articleCard.style.display = 'none';
    fullArticle.style.display = 'block';

    fullArticle.scrollIntoView({ behavior: 'smooth' });
    updateArticlesLayout();
};

window.hideFullArticle = function(articleId) {
    const fullArticle = document.getElementById(articleId);
    if (!fullArticle) return;

    const articleCard = fullArticle.previousElementSibling;
    if (!articleCard) return;

    fullArticle.style.display = 'none';
    articleCard.style.display = 'block';

    articleCard.scrollIntoView({ behavior: 'smooth' });
    updateArticlesLayout();
};

// === Karusszel ===

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

    prevButton.addEventListener('click', prevItem);
    nextButton.addEventListener('click', nextItem);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showItem(index);
        });
    });

    function startAutoPlay() {
        carouselInterval = setInterval(nextItem, 4000);
    }

    function stopAutoPlay() {
        clearInterval(carouselInterval);
    }

    startAutoPlay();

    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
        carouselContainer.addEventListener('touchstart', stopAutoPlay, { passive: true });
        carouselContainer.addEventListener('touchend', startAutoPlay, { passive: true });
    }
}

// === Galéria ===

function initGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    const galleryPrev = document.querySelector('.gallery-prev');
    const galleryNext = document.querySelector('.gallery-next');
    
    if (!galleryContainer || !galleryWrapper || !galleryPrev || !galleryNext) return;

    let galleryCurrentIndex = 0;
    const itemWidth = 250;
    const gap = 10;

    function getVisibleColumns() {
        const containerWidth = galleryContainer.clientWidth;
        return Math.floor(containerWidth / (itemWidth + gap));
    }

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

    galleryPrev.addEventListener('click', prevGallery);
    galleryNext.addEventListener('click', nextGallery);

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
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    galleryContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    galleryContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextGallery();
            } else {
                prevGallery();
            }
        }
    }, { passive: true });
}

// === Modal ===

function initModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    
    if (!modal || !modalImg) return;

    let currentImageSet = [];
    let currentImageIndex = 0;

    function openModal(imageSrc, imageAlt, imageSet, imageIndex) {
        modal.style.display = 'flex';
        modalImg.src = imageSrc;
        modalImg.alt = imageAlt;
        currentImageSet = imageSet;
        currentImageIndex = imageIndex;
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function nextModalImage() {
        if (currentImageSet.length === 0) return;
        currentImageIndex = (currentImageIndex + 1) % currentImageSet.length;
        const nextImage = currentImageSet[currentImageIndex];
        modalImg.src = nextImage.src;
        modalImg.alt = nextImage.alt;
    }

    function prevModalImage() {
        if (currentImageSet.length === 0) return;
        currentImageIndex = (currentImageIndex - 1 + currentImageSet.length) % currentImageSet.length;
        const prevImage = currentImageSet[currentImageIndex];
        modalImg.src = prevImage.src;
        modalImg.alt = prevImage.alt;
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalPrev) modalPrev.addEventListener('click', prevModalImage);
    if (modalNext) modalNext.addEventListener('click', nextModalImage);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
        if (modal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') prevModalImage();
            else if (e.key === 'ArrowRight') nextModalImage();
        }
    });

    const carouselImages = document.querySelectorAll('.carousel-item img');
    carouselImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            openModal(img.src, img.alt, Array.from(carouselImages), index);
        });
    });

    const galleryImages = document.querySelectorAll('.gallery-item');
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            openModal(img.src, img.alt, Array.from(galleryImages), index);
        });
    });
}