// Select Elements
const filterButtons = document.querySelectorAll('.btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('close');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const captionText = document.getElementById('caption-text');
const currentCount = document.getElementById('current-count');

// Variables to track state
let currentCategory = 'all'; 
let currentIndex = 0;
let visibleItems = []; // Array to store only currently visible images

// 1. FILTER FUNCTIONALITY
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        currentCategory = button.getAttribute('data-filter');
        
        // Filter logic
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (currentCategory === 'all' || currentCategory === itemCategory) {
                item.classList.remove('hide');
                item.classList.add('show');
            } else {
                item.classList.remove('show');
                item.classList.add('hide');
            }
        });

        // Update the list of currently visible items for the lightbox
        updateVisibleItems();
    });
});

// Helper to update list of visible images (for navigation)
function updateVisibleItems() {
    visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hide'));
}

// Initial call to set visible items
updateVisibleItems();

// 2. LIGHTBOX FUNCTIONALITY

// Open Lightbox on Image Click
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // Find the index of this item within the *visible* items array
        const index = visibleItems.indexOf(item);
        if (index !== -1) {
            currentIndex = index;
            openLightbox(index);
        }
    });
});

function openLightbox(index) {
    const item = visibleItems[index];
    const img = item.querySelector('img');
    const category = item.getAttribute('data-category');
    
    // Set content
    lightboxImg.src = img.src;
    captionText.textContent = category.toUpperCase() + " Photography";
    currentCount.textContent = `${index + 1} / ${visibleItems.length}`;
    
    // Show modal
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling background
}

// Close Lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

closeBtn.addEventListener('click', closeLightbox);

// Close when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// 3. NAVIGATION (NEXT / PREV)

function showNext() {
    currentIndex++;
    if (currentIndex >= visibleItems.length) {
        currentIndex = 0; // Loop back to start
    }
    openLightbox(currentIndex);
}

function showPrev() {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = visibleItems.length - 1; // Loop to end
    }
    openLightbox(currentIndex);
}

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent closing modal
    showNext();
});

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
});