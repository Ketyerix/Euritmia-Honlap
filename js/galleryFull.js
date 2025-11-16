// Galéria oldal specifikus JavaScript
        document.addEventListener('DOMContentLoaded', function() {
            // Aktív gomb beállítása
            setActiveButton('gallery');
            
            // Modal funkció inicializálása
            initGalleryModal();
        });
        
        // Galéria modal funkciók
        function initGalleryModal() {
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('modalImage');
            const modalClose = document.querySelector('.modal-close');
            const modalPrev = document.querySelector('.modal-prev');
            const modalNext = document.querySelector('.modal-next');
            const galleryItems = document.querySelectorAll('.gallery-item img');
            
            if (!modal || !modalImg) return;
            
            let currentImageIndex = 0;
            const imageSet = Array.from(galleryItems);
            
            function openModal(index) {
                if (index < 0 || index >= imageSet.length) return;
                
                modal.style.display = 'flex';
                modalImg.src = imageSet[index].src;
                modalImg.alt = imageSet[index].alt;
                currentImageIndex = index;
                document.body.style.overflow = 'hidden';
            }
            
            function closeModal() {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
            
            function nextImage() {
                currentImageIndex = (currentImageIndex + 1) % imageSet.length;
                openModal(currentImageIndex);
            }
            
            function prevImage() {
                currentImageIndex = (currentImageIndex - 1 + imageSet.length) % imageSet.length;
                openModal(currentImageIndex);
            }
            
            // Eseményfigyelők hozzáadása
            if (modalClose) modalClose.addEventListener('click', closeModal);
            if (modalPrev) modalPrev.addEventListener('click', prevImage);
            if (modalNext) modalNext.addEventListener('click', nextImage);
            
            // Képre kattintás
            galleryItems.forEach((img, index) => {
                img.addEventListener('click', () => {
                    openModal(index);
                });
            });
            
            // Modal bezárása kívülre kattintva
            modal.addEventListener('click', function(e) {
                if (e.target === modal) closeModal();
            });
            
            // Billentyűzet kezelése
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.style.display === 'flex') {
                    closeModal();
                }
                if (modal.style.display === 'flex') {
                    if (e.key === 'ArrowLeft') prevImage();
                    else if (e.key === 'ArrowRight') nextImage();
                }
            });
        }