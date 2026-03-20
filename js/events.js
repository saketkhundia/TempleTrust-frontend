// ========== Events Page JavaScript ==========

document.addEventListener('DOMContentLoaded', async function() {
    await loadAllEvents();
    
    // Event filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterEvents(filter);
        });
    });
});

let allEvents = [];

async function loadAllEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    
    try {
        const response = await AppUtils.API.get('/api/events');
        allEvents = response.events || [];
        
        displayEvents(allEvents);
        
    } catch (error) {
        console.error('Error loading events:', error);
        eventsGrid.innerHTML = '<p class="text-center">Unable to load events.</p>';
    }
}

function displayEvents(events) {
    const eventsGrid = document.getElementById('eventsGrid');
    
    if (events.length === 0) {
        eventsGrid.innerHTML = '<p class="text-center">No events found.</p>';
        return;
    }
    
    eventsGrid.innerHTML = events.map(event => `
        <div class="event-card" data-category="${event.category}">
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
                <p>${event.description}</p>
                ${event.price > 0 ? `
                    <div class="event-footer">
                        <div class="event-price">${AppUtils.formatCurrency(event.price)}</div>
                        ${event.bookingEnabled ? '<button class="btn btn-primary btn-sm">Book Now</button>' : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function filterEvents(category) {
    if (category === 'all') {
        displayEvents(allEvents);
    } else {
        const filtered = allEvents.filter(event => event.category === category);
        displayEvents(filtered);
    }
}
