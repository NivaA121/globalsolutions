/* ================================================================
   product-listing.js  –  shared logic for all product listing pages
   ================================================================ */

/* ---------- Filter group toggle ---------- */
function toggleFilter(id) {
    document.getElementById(id).classList.toggle('open');
}

/* ---------- Heart / wishlist toggle ---------- */
function toggleHeart(btn) {
    btn.classList.toggle('liked');
}

/* ---------- Helpers ---------- */

/**
 * Parse a price string like "₹8,995" or "₹1,299" → number 8995
 */
function parsePrice(card) {
    const raw = card.querySelector('.pl-card-price')?.textContent || '0';
    return parseInt(raw.replace(/[^\d]/g, ''), 10) || 0;
}

/**
 * Read the original DOM order index stored on each card (set at init).
 */
function getOriginalIndex(card) {
    return parseInt(card.dataset.origIndex, 10);
}

/* ---------- Core render function ---------- */

/**
 * Re-orders and shows/hides cards based on current sort + maxPrice.
 *
 * @param {string} sortValue   – value from #pl-sort-select
 * @param {number} maxPrice    – maximum price from slider (Infinity = no limit)
 */
function applyFilters(sortValue, maxPrice) {
    const grid = document.querySelector('.pl-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.pl-card'));

    /* 1. Show/hide by price */
    cards.forEach(card => {
        const price = parsePrice(card);
        card.style.display = price <= maxPrice ? '' : 'none';
    });

    /* 2. Sort visible cards */
    const visible = cards.filter(c => c.style.display !== 'none');
    const hidden = cards.filter(c => c.style.display === 'none');

    let sorted;
    switch (sortValue) {
        case 'Price: Low to High':
            sorted = visible.sort((a, b) => parsePrice(a) - parsePrice(b));
            break;
        case 'Price: High to Low':
            sorted = visible.sort((a, b) => parsePrice(b) - parsePrice(a));
            break;
        default: /* Recommended / Newest – restore original order */
            sorted = visible.sort((a, b) => getOriginalIndex(a) - getOriginalIndex(b));
    }

    /* 3. Re-append in new order (hidden cards go to end) */
    [...sorted, ...hidden].forEach(card => grid.appendChild(card));

    /* 4. Update product count */
    const countEl = document.querySelector('.pl-count');
    if (countEl) {
        countEl.textContent = `${visible.length} product${visible.length !== 1 ? 's' : ''}`;
    }
}

/* ---------- Price slider ---------- */

function initPriceSlider() {
    const slider = document.getElementById('price-slider');
    const valueEl = document.getElementById('price-slider-value');
    if (!slider || !valueEl) return;

    /* Find the highest price among all cards to set the slider max */
    const cards = Array.from(document.querySelectorAll('.pl-card'));
    const prices = cards.map(parsePrice).filter(Boolean);
    const maxVal = prices.length ? Math.max(...prices) : 50000;

    /* Round up to a "nice" ceiling (nearest 5000) */
    const ceiling = Math.ceil(maxVal / 5000) * 5000;
    slider.max = ceiling;
    slider.value = ceiling;            /* default: show all */

    /* Label next to the 0 end */
    const minLabel = document.getElementById('price-min-label');
    if (minLabel) minLabel.textContent = '₹0';

    /* Update the thumb label and right-end label */
    function update() {
        const v = parseInt(slider.value, 10);
        valueEl.textContent = '₹' + v.toLocaleString('en-IN');
        updateSliderFill(slider);
        const sortVal = document.getElementById('pl-sort-select')?.value || 'Recommended';
        applyFilters(sortVal, v);
    }

    slider.addEventListener('input', update);
    update(); /* run once on load */
}

/** Fill the range track in blue up to the thumb position */
function updateSliderFill(slider) {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background =
        `linear-gradient(to right, #115895 0%, #115895 ${pct}%, #dde3ea ${pct}%, #dde3ea 100%)`;
}

/* ---------- Sort select ---------- */

function initSort() {
    const sel = document.getElementById('pl-sort-select');
    if (!sel) return;
    sel.addEventListener('change', () => {
        const slider = document.getElementById('price-slider');
        const maxPrice = slider ? parseInt(slider.value, 10) : Infinity;
        applyFilters(sel.value, maxPrice);
    });
}

/* ---------- Mobile sidebar drawer ---------- */

function openSidebar() {
    const sidebar = document.querySelector('.pl-sidebar');
    const overlay = document.getElementById('pl-sidebar-overlay');
    if (!sidebar) return;
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    const sidebar = document.querySelector('.pl-sidebar');
    const overlay = document.getElementById('pl-sidebar-overlay');
    if (!sidebar) return;
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

/* ---------- Bootstrap ---------- */

document.addEventListener('DOMContentLoaded', () => {
    /* Tag each card with its original DOM-order index */
    document.querySelectorAll('.pl-card').forEach((card, i) => {
        card.dataset.origIndex = i;
    });

    initSort();
    initPriceSlider();

    /* Wire up filter toggle button */
    const filterBtn = document.getElementById('pl-filter-toggle');
    if (filterBtn) filterBtn.addEventListener('click', openSidebar);

    /* Wire up overlay backdrop */
    const overlay = document.getElementById('pl-sidebar-overlay');
    if (overlay) overlay.addEventListener('click', closeSidebar);

    /* Wire up close button inside sidebar */
    const closeBtn = document.getElementById('pl-sidebar-close');
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

    /* Close sidebar on Escape key */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeSidebar();
    });

    /* ---- Product card → detail page navigation ---- */
    const listingPage = window.location.pathname.split('/').pop() || '';

    document.querySelectorAll('.pl-card').forEach(card => {

        /* Stop heart-button click from navigating to detail page */
        const heart = card.querySelector('.pl-heart');
        if (heart) {
            heart.addEventListener('click', e => e.stopPropagation());
        }

        card.addEventListener('click', () => {
            const name = card.querySelector('.pl-card-name')?.textContent?.trim() || 'Product';
            const price = card.querySelector('.pl-card-price')?.textContent?.trim() || '';
            const imgEl = card.querySelector('.pl-img-wrap img');
            const imgSrc = imgEl ? imgEl.getAttribute('src') : '';
            const badgeEl = card.querySelector('.pl-badge');
            const badge = badgeEl ? badgeEl.textContent.trim() : '';

            const product = { name, price, imgSrc, badge, listingPage };
            try {
                localStorage.setItem('gs_selected_product', JSON.stringify(product));
            } catch (e) { /* storage unavailable – silent fail */ }

            window.location.href = 'product-detail.html';
        });
    });
});
