// ========== Gallery Page JavaScript ==========

document.addEventListener('DOMContentLoaded', async function() {
    await loadGallery();
    
    // Gallery filters
    document.querySelectorAll('.gallery-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.gallery-filter .filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterGallery(filter);
        });
    });
    
    // Lightbox
    setupLightbox();
});

let allImages = [];
let currentImageIndex = 0;

async function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    
    try {
        const response = await AppUtils.API.get('/api/gallery');
        allImages = response.images || [];
        
        displayGallery(allImages);
        
    } catch (error) {
        console.error('Error loading gallery:', error);
        galleryGrid.innerHTML = '<p class="text-center">Unable to load gallery.</p>';
    }
}

function displayGallery(images) {
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (images.length === 0) {
        galleryGrid.innerHTML = '<p class="text-center">No images found.</p>';
        return;
    }
    
    galleryGrid.innerHTML = images.map((image, index) => `
        <div class="gallery-item" data-category="${image.category}" data-index="${index}">
            <img src="${image.imageUrl}" alt="${image.title}" loading="lazy">
            <div class="gallery-overlay">
                <h4>${image.title}</h4>
                <p>${image.description || ''}</p>
                <button class="btn btn-outline btn-sm view-image">
                    <i class="fas fa-search-plus"></i> View
                </button>
            </div>
        </div>
    `).join('');
    
    // Add click listeners
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.querySelector('.view-image').addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-index'));
            openLightbox(index);
        });
    });
}

function filterGallery(category) {
    if (category === 'all') {
        displayGallery(allImages);
    } else {
        const filtered = allImages.filter(image => image.category === category);
        displayGallery(filtered);
    }
}

function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('show')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        }
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    const image = allImages[index];
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    
    lightboxImg.src = image.imageUrl;
    lightboxImg.alt = image.title;
    
    lightbox.classList.add('show');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('show');
}

function navigateLightbox(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = allImages.length - 1;
    } else if (currentImageIndex >= allImages.length) {
        currentImageIndex = 0;
    }
    
    const image = allImages[currentImageIndex];
    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.src = image.imageUrl;
    lightboxImg.alt = image.title;
}
