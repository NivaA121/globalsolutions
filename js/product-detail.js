/* ================================================================
   product-detail.js
   Reads product data stored by product-listing.js and populates
   the product-detail.html page.
   ================================================================ */

/* ----- Spec / highlight lookup tables keyed by category ----- */

/**
 * Returns an array of spec objects: { label, value }
 * based on the product name and category.
 */
function buildSpecs(name, price, category) {
    const priceNum = parseInt(String(price).replace(/[^0-9]/g, ''), 10) || 0;

    const map = {
        battery: [
            { label: 'Brand', value: 'Lapcare' },
            { label: 'Cell Type', value: name.includes('6-Cell') ? '6-Cell Li-Ion' : '4-Cell Li-Ion' },
            { label: 'Voltage', value: '10.8 V' },
            { label: 'Capacity', value: '48 Wh' },
            { label: 'Warranty', value: '6 Months' },
        ],
        charger: [
            { label: 'Brand', value: 'Lapcare' },
            { label: 'Output', value: name.includes('90W') ? '90W' : name.includes('65W') ? '65W' : '45W' },
            { label: 'Connector', value: 'Universal Barrel' },
            { label: 'Input', value: '100–240V AC' },
            { label: 'Warranty', value: '1 Year' },
        ],
        adapter: [
            { label: 'Brand', value: 'Lapcare' },
            { label: 'Type', value: name.includes('HDMI') ? 'USB-C to HDMI' : name.includes('VGA') ? 'USB-C to VGA' : 'USB-C Hub' },
            { label: 'Resolution', value: name.includes('4K') ? '4K @ 60Hz' : 'Full HD' },
            { label: 'Cable Len.', value: '0.15 m' },
            { label: 'Warranty', value: '1 Year' },
        ],
        webcam: [
            { label: 'Brand', value: 'Lapcare' },
            { label: 'Resolution', value: name.includes('4K') ? '4K UHD' : name.includes('2K') ? '2K QHD' : '1080p FHD' },
            { label: 'Frame Rate', value: '30 fps' },
            { label: 'Microphone', value: 'Built-in' },
            { label: 'Warranty', value: '1 Year' },
        ],
        monitor: [
            { label: 'Brand', value: 'Lapcare' },
            { label: 'Screen Size', value: name.includes('27') ? '27"' : name.includes('24') ? '24"' : name.includes('21') ? '21.5"' : '18.5"' },
            { label: 'Resolution', value: name.includes('QHD') ? '2560×1440' : '1920×1080' },
            { label: 'Panel', value: 'IPS' },
            { label: 'Warranty', value: '3 Years' },
        ],
        keymouse: [
            { label: 'Brand', value: 'Lapcare' },
            { label: 'Type', value: name.includes('Wireless') ? 'Wireless 2.4GHz' : name.includes('Bluetooth') ? 'Bluetooth' : 'Wired USB' },
            { label: 'DPI', value: '1000 – 1600' },
            { label: 'Colour', value: 'Black / Silver' },
            { label: 'Warranty', value: '1 Year' },
        ],
        toner: [
            { label: 'Brand', value: 'Lapcare / OEM' },
            { label: 'Type', value: name.toLowerCase().includes('toner') ? 'Toner Cartridge' : 'Ink Cartridge' },
            { label: 'Colour', value: 'Black' },
            { label: 'Page Yield', value: '~1,500 pages' },
            { label: 'Warranty', value: '6 Months' },
        ],
        cpufan: [
            { label: 'Brand', value: 'Lapcare' },
            { label: 'Speed', value: '3500 RPM' },
            { label: 'Connector', value: '3-Pin / 4-Pin' },
            { label: 'Noise', value: '< 28 dBA' },
            { label: 'Warranty', value: '6 Months' },
        ],
        ups: [
            { label: 'Brand', value: 'Lapcare' },
            { label: 'Capacity', value: '800 VA' },
            { label: 'Battery', value: '12V 7Ah' },
            { label: 'Backup', value: '20–30 min' },
            { label: 'Warranty', value: '1 Year' },
        ],
    };

    return map[category] || [
        { label: 'Brand', value: 'Lapcare' },
        { label: 'Warranty', value: '1 Year' },
    ];
}

/**
 * Returns highlight items: { icon, label, value }
 * icon is an <img> HTML string pointing to the icons/ folder.
 */
function buildHighlights(name, category) {
    /* Shorthand helpers for the 6 custom icons */
    const IC = {
        battery: `<img src="icons/hl-battery.svg"    alt="" class="pd-hl-svg-icon">`,
        voltage: `<img src="icons/hl-voltage.svg"    alt="" class="pd-hl-svg-icon">`,
        compatible: `<img src="icons/hl-compatible.svg" alt="" class="pd-hl-svg-icon">`,
        warranty: `<img src="icons/hl-warranty.svg"   alt="" class="pd-hl-svg-icon">`,
        condition: `<img src="icons/hl-condition.svg"  alt="" class="pd-hl-svg-icon">`,
        connector: `<img src="icons/hl-connector.svg"  alt="" class="pd-hl-svg-icon">`,
    };

    const map = {
        battery: [
            { icon: IC.battery, label: 'Cell Type', value: name.includes('6-Cell') ? '6-Cell Li-Ion' : '4-Cell Li-Ion' },
            { icon: IC.voltage, label: 'Voltage', value: '10.8 V / 48 Wh' },
            { icon: IC.compatible, label: 'Compatible', value: name.split(' ')[1] || 'Universal' },
            { icon: IC.warranty, label: 'Warranty', value: '6 Months' },
            { icon: IC.condition, label: 'Condition', value: 'Brand New' },
            { icon: IC.connector, label: 'Connector', value: 'OEM Standard' },
        ],
        charger: [
            { icon: IC.voltage, label: 'Output Power', value: name.includes('90W') ? '90 W' : name.includes('65W') ? '65 W' : '45 W' },
            { icon: IC.connector, label: 'Connector', value: 'Universal Barrel' },
            { icon: IC.battery, label: 'Input Voltage', value: '100–240 V AC' },
            { icon: IC.compatible, label: 'Compatible', value: name.split(' ')[1] || 'Universal' },
            { icon: IC.warranty, label: 'Warranty', value: '1 Year' },
            { icon: IC.condition, label: 'Certification', value: 'BIS Certified' },
        ],
        adapter: [
            { icon: IC.connector, label: 'Output', value: name.includes('HDMI') ? 'HDMI' : name.includes('VGA') ? 'VGA' : 'Multi-port' },
            { icon: IC.battery, label: 'Input', value: 'USB-C / USB-A' },
            { icon: IC.voltage, label: 'Resolution', value: name.includes('4K') ? '4K @ 60Hz' : 'Full HD' },
            { icon: IC.condition, label: 'Cable Length', value: '0.15 m' },
            { icon: IC.warranty, label: 'Warranty', value: '1 Year' },
            { icon: IC.compatible, label: 'Compatibility', value: 'Windows / Mac / Linux' },
        ],
        webcam: [
            { icon: IC.voltage, label: 'Resolution', value: name.includes('4K') ? '4K UHD' : name.includes('2K') ? '2K QHD' : '1080p FHD' },
            { icon: IC.condition, label: 'Microphone', value: 'Built-in Stereo' },
            { icon: IC.battery, label: 'Frame Rate', value: '30 fps' },
            { icon: IC.connector, label: 'Connection', value: 'USB Plug & Play' },
            { icon: IC.warranty, label: 'Warranty', value: '1 Year' },
            { icon: IC.compatible, label: 'Compatibility', value: 'Windows / Mac / Linux' },
        ],
        monitor: [
            { icon: IC.condition, label: 'Screen Size', value: name.includes('27') ? '27"' : name.includes('24') ? '24"' : name.includes('21') ? '21.5"' : '18.5"' },
            { icon: IC.voltage, label: 'Resolution', value: name.includes('QHD') ? '2560×1440 (QHD)' : '1920×1080 (FHD)' },
            { icon: IC.battery, label: 'Panel Type', value: 'IPS Anti-glare' },
            { icon: IC.compatible, label: 'Response Time', value: '5 ms' },
            { icon: IC.connector, label: 'Connectivity', value: 'HDMI + VGA' },
            { icon: IC.warranty, label: 'Warranty', value: '3 Years On-site' },
        ],
        keymouse: [
            { icon: IC.condition, label: 'Keyboard Type', value: 'Membrane' },
            { icon: IC.voltage, label: 'Mouse DPI', value: '1000–1600 DPI' },
            { icon: IC.compatible, label: 'Connection', value: name.includes('Wireless') ? '2.4GHz Wireless' : name.includes('Bluetooth') ? 'Bluetooth 5.0' : 'USB Wired' },
            { icon: IC.battery, label: 'Battery Life', value: name.includes('Wired') ? 'N/A (wired)' : 'Up to 12 months' },
            { icon: IC.warranty, label: 'Warranty', value: '1 Year' },
            { icon: IC.condition, label: 'Layout', value: 'Standard 104-key' },
        ],
        toner: [
            { icon: IC.condition, label: 'Type', value: name.toLowerCase().includes('toner') ? 'Toner Cartridge' : 'Ink Cartridge' },
            { icon: IC.battery, label: 'Colour', value: 'Black' },
            { icon: IC.voltage, label: 'Page Yield', value: '~1,500 pages' },
            { icon: IC.compatible, label: 'Printer Brand', value: name.split(' ')[0] },
            { icon: IC.warranty, label: 'Warranty', value: '6 Months' },
            { icon: IC.condition, label: 'Quality', value: 'OEM Grade' },
        ],
        cpufan: [
            { icon: IC.voltage, label: 'Speed', value: '3500 RPM' },
            { icon: IC.connector, label: 'Connector', value: '3-Pin / 4-Pin PWM' },
            { icon: IC.condition, label: 'Noise Level', value: '< 28 dBA' },
            { icon: IC.battery, label: 'Fan Size', value: '70 mm – 80 mm' },
            { icon: IC.warranty, label: 'Warranty', value: '6 Months' },
            { icon: IC.compatible, label: 'Compatibility', value: 'Universal Fit' },
        ],
        ups: [
            { icon: IC.voltage, label: 'Capacity', value: '800 VA / 480 W' },
            { icon: IC.battery, label: 'Battery', value: '12V 7Ah Sealed Lead-Acid' },
            { icon: IC.compatible, label: 'Backup Time', value: '20–30 minutes' },
            { icon: IC.connector, label: 'Outlets', value: '3 × IEC Sockets' },
            { icon: IC.warranty, label: 'Warranty', value: '1 Year' },
            { icon: IC.condition, label: 'Type', value: 'Offline / Standby' },
        ],
    };

    return map[category] || [
        { icon: IC.condition, label: 'Quality', value: 'Premium Grade' },
        { icon: IC.warranty, label: 'Warranty', value: '1 Year' },
    ];
}

/* generate a pseudo-random rating from the name string (stable) */
function stableRating(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
    hash = Math.abs(hash);
    return (3.8 + (hash % 13) / 10).toFixed(1); // 3.8 – 5.0
}

function starString(rating) {
    const r = parseFloat(rating);
    const full = Math.floor(r);
    const half = r - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

/* ----- Plan select ----- */
function selectPlan(id) {
    ['none', '1yr', '2yr'].forEach(p => {
        document.getElementById('plan-' + p)
            ?.classList.toggle('selected', p === id);
    });
}
window.selectPlan = selectPlan; // expose to inline onclick

/* ----- Thumbnail click ----- */
function initThumbs(imgSrc) {
    const mainImg = document.getElementById('pd-main-img');
    const thumbWrap = document.getElementById('pd-thumbs');
    if (!thumbWrap) return;

    thumbWrap.querySelectorAll('.pd-thumb').forEach(thumb => {
        const idx = parseInt(thumb.dataset.idx, 10);
        const thumbImg = thumb.querySelector('img');

        /* all thumbs show the same product image (single image site) */
        thumbImg.src = imgSrc;
        thumbImg.alt = 'Product image ' + (idx + 1);

        thumb.addEventListener('click', () => {
            mainImg.src = thumbImg.src;
            thumbWrap.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
}

/* ----- Category map: guess category from referring page / stored key ----- */
function getCategory(listingPage) {
    const p = (listingPage || '').toLowerCase();
    if (p.includes('battery')) return 'battery';
    if (p.includes('charger')) return 'charger';
    if (p.includes('adapter')) return 'adapter';
    if (p.includes('webcam')) return 'webcam';
    if (p.includes('monitor')) return 'monitor';
    if (p.includes('keymouse')) return 'keymouse';
    if (p.includes('toner')) return 'toner';
    if (p.includes('cpufan')) return 'cpufan';
    if (p.includes('ups')) return 'ups';
    return 'general';
}

/* ----- Category display name ----- */
function categoryLabel(cat) {
    const m = {
        battery: 'Battery',
        charger: 'Charger',
        adapter: 'Adapter',
        webcam: 'Webcam',
        monitor: 'Monitor',
        keymouse: 'Keyboard & Mouse',
        toner: 'Toner / Cartridges',
        cpufan: 'CPU Fan',
        ups: 'UPS',
    };
    return m[cat] || 'Lapcare Products';
}

/* ----- Category page link ----- */
function categoryPage(cat) {
    const m = {
        battery: 'lapcare_battery.html',
        charger: 'lapcare_charger.html',
        adapter: 'lapcare_adapter.html',
        webcam: 'lapcare_webcam.html',
        monitor: 'lapcare_monitor.html',
        keymouse: 'lapcare_keymouse.html',
        toner: 'lapcare_toner.html',
        cpufan: 'lapcare_cpufan.html',
        ups: 'lapcare_ups.html',
    };
    return m[cat] || 'product.html';
}

/* ----- Short description generator ----- */
function buildDesc(name, category) {
    const descs = {
        battery: `The ${name} is a high-capacity Li-Ion replacement battery that powers your laptop reliably. Engineered to meet OEM specifications, it provides consistent performance and a long cycle life.`,
        charger: `The ${name} delivers clean, efficient power to your laptop. Its smart IC circuitry prevents overcharging and overheating, ensuring both device and charger longevity.`,
        adapter: `The ${name} expands your laptop's connectivity with fast, stable data and video transmission. Compact and portable — perfect for office and travel use.`,
        webcam: `The ${name} streams crystal-clear video with built-in stereo microphone. Plug-and-play over USB — no drivers needed.`,
        monitor: `The ${name} delivers vibrant, accurate colours on an IPS anti-glare panel. Wide viewing angles and flicker-free technology reduce eye strain during long work sessions.`,
        keymouse: `The ${name} combo offers a comfortable, responsive typing and pointing experience. Compact, quiet, and durable — ideal for home and office use.`,
        toner: `The ${name} is an OEM-grade replacement that delivers sharp, consistent prints at a fraction of OEM cost. Engineered for precise ink/toner distribution.`,
        cpufan: `The ${name} keeps your laptop running cool and quiet. Its precision-balanced blades and sealed bearings ensure smooth, long-lasting airflow.`,
        ups: `The ${name} provides uninterrupted power protection against blackouts, surges, and voltage fluctuations — safeguarding your valuable equipment.`,
    };
    return descs[category] || `The ${name} is a premium Lapcare product designed for reliability and long-term performance.`;
}

/* =========================================================
   MAIN BOOT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    /* Read product from localStorage */
    let product;
    try {
        product = JSON.parse(localStorage.getItem('gs_selected_product') || 'null');
    } catch (e) { product = null; }

    if (!product) {
        /* No product stored — redirect back gracefully */
        document.querySelector('.pd-page').innerHTML =
            '<p style="font-size:2.4rem;padding:4rem;text-align:center;">No product selected. ' +
            '<a href="product.html" style="color:#115895">Browse products →</a></p>';
        return;
    }

    const { name, price, imgSrc, badge, listingPage } = product;
    const category = getCategory(listingPage);
    const specs = buildSpecs(name, price, category);
    const highlights = buildHighlights(name, category);
    const rating = stableRating(name);
    const reviewCount = (Math.abs(name.length * 37 + 120) % 900) + 80;
    const priceNum = parseInt(String(price).replace(/[^0-9]/g, ''), 10) || 0;
    const originalPrice = Math.round(priceNum * 1.15 / 100) * 100;
    const saving = originalPrice - priceNum;

    /* ---- Page title ---- */
    document.title = name + ' – Global Solutions';
    document.getElementById('pd-page-title').textContent = name + ' – Global Solutions';

    /* ---- Breadcrumb ---- */
    const catLink = document.getElementById('pd-cat-link');
    catLink.textContent = categoryLabel(category);
    catLink.href = categoryPage(category);
    document.getElementById('pd-crumb-name').textContent = name;

    /* ---- Gallery ---- */
    const mainImg = document.getElementById('pd-main-img');
    mainImg.src = imgSrc;
    mainImg.alt = name;
    initThumbs(imgSrc);

    /* ---- Badge ---- */
    const badgeRow = document.getElementById('pd-badge-row');
    if (badge) {
        const span = document.createElement('span');
        span.className = 'pd-tag ' + badge.toLowerCase();
        span.textContent = badge;
        badgeRow.appendChild(span);
    }
    /* also add a "Deal" tag to show savings */
    if (saving > 0) {
        const dealTag = document.createElement('span');
        dealTag.className = 'pd-tag deal';
        dealTag.textContent = `Save ₹${saving.toLocaleString('en-IN')}`;
        badgeRow.appendChild(dealTag);
    }

    /* ---- Name ---- */
    document.getElementById('pd-name').textContent = name;

    /* ---- Model ---- */
    const modelCode = 'GS-' + Math.abs(name.charCodeAt(0) * 11 + priceNum % 9999).toString().padStart(4, '0');
    document.getElementById('pd-model').textContent =
        `Model: ${modelCode}  |  Available at Global Solutions, Ahmedabad`;

    /* ---- Stars ---- */
    document.getElementById('pd-stars-icon').textContent = starString(rating);
    document.getElementById('pd-rating').textContent = rating;
    document.getElementById('pd-reviews').textContent = `(${reviewCount.toLocaleString('en-IN')} reviews)`;

    /* ---- Price ---- */
    document.getElementById('pd-price').textContent = price;
    if (originalPrice > priceNum) {
        document.getElementById('pd-price-original').textContent =
            '₹' + originalPrice.toLocaleString('en-IN');
        const saveEl = document.getElementById('pd-price-save');
        saveEl.textContent = `Save ₹${saving.toLocaleString('en-IN')}`;
        saveEl.style.display = '';
    }

    /* ---- Short description ---- */
    document.getElementById('pd-short-desc').textContent = buildDesc(name, category);

    /* ---- Specs panel ---- */
    const specsList = document.getElementById('pd-specs-list');
    specs.forEach((s, i) => {
        const row = document.createElement('div');
        row.className = 'pd-spec-row';
        if (i > 0) {
            const hr = document.createElement('hr');
            hr.className = 'pd-divider';
            specsList.appendChild(hr);
        }
        row.innerHTML =
            `<span class="pd-spec-label">${s.label}</span>` +
            `<span class="pd-spec-val">${s.value}</span>`;
        specsList.appendChild(row);
    });

    /* ---- Highlights grid ---- */
    const hlGrid = document.getElementById('pd-highlights-grid');
    highlights.forEach(h => {
        const item = document.createElement('div');
        item.className = 'pd-hl-item';
        item.innerHTML =
            `<span class="pd-hl-icon">${h.icon}</span>` +
            `<span class="pd-hl-label">${h.label}</span>` +
            `<span class="pd-hl-val">${h.value}</span>`;
        hlGrid.appendChild(item);
    });

    /* ---- Plan prices (relative to product price) ---- */
    const p1 = Math.round(priceNum * 0.08 / 50) * 50 || 199;
    const p2 = Math.round(priceNum * 0.14 / 50) * 50 || 349;
    document.getElementById('plan-1yr-price').textContent = '₹' + p1.toLocaleString('en-IN');
    document.getElementById('plan-2yr-price').textContent = '₹' + p2.toLocaleString('en-IN');
});
