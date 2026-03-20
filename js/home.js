// ========== Home Page JavaScript ==========

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize Hero Slider
    initHeroSlider();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Load stats
    await loadStats();
    
    // Load recent events
    await loadEvents();
});

// ========== Hero Slider ==========
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');
    
    if (!slides.length || !dotsContainer) return;
    
    let currentSlide = 0;
    let autoSlideTimer;
    
    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    
    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        resetAutoSlide();
    }
    
    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }
    
    function prevSlide() {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideTimer);
        autoSlideTimer = setInterval(nextSlide, 5000);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Start auto-slide
    autoSlideTimer = setInterval(nextSlide, 5000);
}

// ========== Scroll Animations ==========
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };
    
    const animObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards and animated elements
    document.querySelectorAll('.service-card, .campaign-card, .stat-card, .timings-card, .testimonial-card, .event-card, .animate-on-scroll').forEach(el => {
        animObserver.observe(el);
    });
}

// ========== Load Stats ==========
async function loadStats() {
    try {
        const stats = await AppUtils.API.get('/api/stats/public');
        
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (statNumbers[0]) {
            statNumbers[0].setAttribute('data-count', stats.totalDonors || 0);
            animateCounter(statNumbers[0], stats.totalDonors || 0);
        }
        
        if (statNumbers[1]) {
            statNumbers[1].textContent = AppUtils.formatCurrency(stats.totalAmount || 0);
        }
        
        if (statNumbers[2]) {
            statNumbers[2].setAttribute('data-count', stats.totalEvents || 50);
            animateCounter(statNumbers[2], stats.totalEvents || 50);
        }
        
        if (statNumbers[3]) {
            const livesTouched = (stats.totalDonors || 0) * 10;
            statNumbers[3].setAttribute('data-count', livesTouched);
            animateCounter(statNumbers[3], livesTouched);
        }
        
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// ========== Load Events ==========
async function loadEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    if (!eventsGrid) return;
    
    try {
        const response = await AppUtils.API.get('/api/events?limit=3');
        const events = response.events || [];
        
        if (events.length === 0) {
            eventsGrid.innerHTML = '<p class="text-center" style="grid-column: 1/-1; color: var(--text-light);">No upcoming events at the moment.</p>';
            return;
        }
        
        eventsGrid.innerHTML = events.map(event => `
            <div class="event-card">
                <div class="event-image">
                    <img src="${event.image || '/images/event-default.jpg'}" alt="${event.title}" loading="lazy">
                    <div class="event-category">${event.category}</div>
                </div>
                <div class="event-content">
                    <h3>${event.title}</h3>
                    <div class="event-meta">
                        <span><i class="fas fa-calendar"></i> ${AppUtils.formatDate(event.date)}</span>
                        <span><i class="fas fa-clock"></i> ${event.time}</span>
                    </div>
                    <p>${event.description.substring(0, 100)}...</p>
                    ${event.price > 0 ? `<div class="event-price">${AppUtils.formatCurrency(event.price)}</div>` : ''}
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading events:', error);
        eventsGrid.innerHTML = '<p class="text-center" style="grid-column: 1/-1; color: var(--text-light);">Unable to load events.</p>';
    }
}

// ========== Counter Animation ==========
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = Math.floor(target).toLocaleString('en-IN');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString('en-IN');
        }
    }, 16);
}
