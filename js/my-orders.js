/* ============================================================
   MY ORDERS PAGE — my-orders.js
   Reads orders from localStorage (gs_orders), renders cards.
   ============================================================ */

/* ---- Read / write orders for the current user ---- */
function getOrdersKey() {
    const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    return user ? 'gs_orders_' + user.id : null;
}

function getOrders() {
    const key = getOrdersKey();
    if (!key) return [];
    try {
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch { return []; }
}

function saveOrders(orders) {
    const key = getOrdersKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(orders));
}

/* ---- Seed demo orders if this user has none ---- */
function seedDemoOrders() {
    const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    if (!user) return; // not logged in – nothing to seed

    // Only seed once per account
    const seededKey = 'gs_demo_seeded_' + user.id;
    if (localStorage.getItem(seededKey)) return;

    const orders = getOrders();
    if (orders.length > 0) {
        // User already has real orders – mark as seeded and skip
        localStorage.setItem(seededKey, '1');
        return;
    }

    const userName = user.name || 'Customer';

    const demoOrders = [
        {
            id: 'GS-' + (73260 + Math.floor(Math.random() * 100)),
            date: '2026-03-10T13:45:00',
            status: 'on-the-way',
            statusLabel: 'On the way',
            customerName: userName,
            deliveryDate: 'Fri, 14 Mar, 2026',
            deliveryAddress: 'A-132 Populer Plaza, Satellite, Ahmedabad 380015',
            paymentMethod: 'Debit Card',
            items: [
                { name: 'Logitech Wireless Keyboard', qty: 1, price: 4999, img: 'keyboard.png' },
                { name: 'Logitech Wireless Mouse', qty: 1, price: 2499, img: 'mice.png' },
                { name: 'USB Webcam HD 1080p', qty: 1, price: 3299, img: 'webcam.png' },
                { name: 'Fingers Stereo Earphones', qty: 2, price: 899, img: 'earphones.png' }
            ],
            total: 12595
        },
        {
            id: 'GS-' + (9170 + Math.floor(Math.random() * 100)),
            date: '2026-03-05T09:30:00',
            status: 'delivered',
            statusLabel: 'Delivered',
            customerName: userName,
            deliveryDate: 'Mon, 10 Mar, 2026',
            deliveryAddress: 'A-132 Populer Plaza, Satellite, Ahmedabad 380015',
            paymentMethod: 'UPI',
            items: [
                { name: 'Lapcare Battery Pack', qty: 1, price: 6750, img: 'battery.png' },
                { name: 'Lapcare Power Adapter', qty: 1, price: 2450, img: 'adapter.png' },
                { name: 'Stereo Headset Pro', qty: 1, price: 1899, img: 'headset.png' }
            ],
            total: 11099
        },
        {
            id: 'GS-' + (4500 + Math.floor(Math.random() * 100)),
            date: '2026-02-20T15:12:00',
            status: 'delivered',
            statusLabel: 'Delivered',
            customerName: userName,
            deliveryDate: 'Thu, 27 Feb, 2026',
            deliveryAddress: 'A-132 Populer Plaza, Satellite, Ahmedabad 380015',
            paymentMethod: 'Cash on Delivery',
            items: [
                { name: 'CPU Cooling Fan', qty: 1, price: 3500, img: 'cpufan.png' },
                { name: 'Fingers Bluetooth Speaker', qty: 1, price: 2999, img: 'speakers.png' }
            ],
            total: 6699
        }
    ];

    saveOrders(demoOrders);
    localStorage.setItem(seededKey, '1');
}

/* ---- Format date ---- */
function formatOrderDate(isoStr) {
    const d = new Date(isoStr);
    const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
    const date = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${time}, ${date}`;
}

/* ---- Format currency ---- */
function formatPrice(num) {
    return '₹' + num.toLocaleString('en-IN');
}

/* ---- Get progress percentage for status ---- */
function getProgressInfo(status) {
    switch (status) {
        case 'processing':
            return { pct: 0, steps: [true, false, false, false] };
        case 'shipped':
            return { pct: 33, steps: [true, true, false, false] };
        case 'on-the-way':
            return { pct: 66, steps: [true, true, true, false] };
        case 'delivered':
            return { pct: 100, steps: [true, true, true, true] };
        case 'cancelled':
            return { pct: 0, steps: [false, false, false, false] };
        default:
            return { pct: 0, steps: [true, false, false, false] };
    }
}

/* ---- Render a single order card ---- */
function renderOrderCard(order) {
    const progress = getProgressInfo(order.status);
    const stepLabels = ['Confirmed', 'Shipped', 'On the way', 'Delivered'];
    const itemCount = order.items.reduce((sum, i) => sum + i.qty, 0);

    let productsHTML = '';
    order.items.forEach(item => {
        productsHTML += `
            <div class="order-product-item">
                <div class="order-product-img">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="order-product-info">
                    <div class="order-product-name">${item.name}</div>
                    <div class="order-product-meta">
                        Quantity: ${item.qty}x = <strong>${formatPrice(item.price * item.qty)}</strong>
                    </div>
                </div>
            </div>
        `;
    });

    let progressHTML = '';
    if (order.status !== 'cancelled') {
        const fillWidth = progress.pct * 0.76; // scale to track area (76%)
        progressHTML = `
            <div class="order-progress">
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${fillWidth}%"></div>
                    ${stepLabels.map((label, i) => {
            let cls = '';
            if (progress.steps[i] && (i < stepLabels.length - 1 || order.status === 'delivered')) {
                cls = 'completed';
            } else if (i > 0 && progress.steps[i - 1] && !progress.steps[i]) {
                cls = 'current';
            } else if (i === 0 && progress.steps[0]) {
                cls = 'completed';
            }
            return `
                            <div class="progress-step ${cls}">
                                <div class="progress-dot"></div>
                                <span class="progress-label">${label}</span>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    }

    let footerHTML = '';
    if (order.status === 'delivered') {
        footerHTML = `
            <div class="order-card-footer">
                <button class="btn-reorder" onclick="reorderItems('${order.id}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="1 4 1 10 7 10"/>
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                    </svg>
                    Re-order
                </button>
            </div>
        `;
    } else if (order.status !== 'cancelled') {
        footerHTML = `
            <div class="order-card-footer">
                <button class="btn-track" onclick="alert('Tracking details coming soon!')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="3" width="15" height="13"/>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                        <circle cx="5.5" cy="18.5" r="2.5"/>
                        <circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                    Track Order
                </button>
            </div>
        `;
    }

    return `
        <div class="order-card" data-status="${order.status}" data-order-id="${order.id}">
            <div class="order-card-header">
                <div class="order-header-left">
                    <h2>Order #${order.id}</h2>
                    <div class="order-meta-line">
                        ${itemCount} Product${itemCount > 1 ? 's' : ''}
                        <span>|</span>
                        By ${order.customerName}
                        <span>|</span>
                        ${formatOrderDate(order.date)}
                    </div>
                </div>
                <div class="order-header-right">
                    <button class="btn-download-invoice" onclick="alert('Invoice download coming soon!')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        <span>Download invoice</span>
                    </button>
                    <button class="btn-order-menu" onclick="this.classList.toggle('active')">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="2"/>
                            <circle cx="12" cy="12" r="2"/>
                            <circle cx="12" cy="19" r="2"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="order-details">
                <div class="order-detail-row">
                    <span class="order-detail-label">Status:</span>
                    <span class="order-detail-value">
                        <span class="status-badge status-${order.status}">${order.statusLabel}</span>
                    </span>
                </div>
                <div class="order-detail-row">
                    <span class="order-detail-label">Date of delivery:</span>
                    <span class="order-detail-value">${order.deliveryDate}</span>
                </div>
                <div class="order-detail-row">
                    <span class="order-detail-label">Delivered to:</span>
                    <span class="order-detail-value">${order.deliveryAddress}</span>
                </div>
                <div class="order-detail-row">
                    <span class="order-detail-label">Payment:</span>
                    <span class="order-detail-value">${order.paymentMethod}</span>
                </div>
                <div class="order-detail-row">
                    <span class="order-detail-label">Total:</span>
                    <span class="order-detail-value total-value">${formatPrice(order.total)}</span>
                </div>
            </div>

            ${progressHTML}

            <div class="order-products">
                ${productsHTML}
            </div>

            ${footerHTML}
        </div>
    `;
}

/* ---- Render all orders ---- */
function renderOrders(filter = 'all') {
    const container = document.getElementById('orders-container');
    if (!container) return;

    // Check login
    const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    if (!user) {
        container.innerHTML = `
            <div class="orders-login-state">
                <div class="orders-login-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                </div>
                <h2>Sign In Required</h2>
                <p>Please sign in to view your order history and track deliveries.</p>
                <button class="btn-login-now" onclick="window.location.href='login.html'">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                        <polyline points="10 17 15 12 10 7"/>
                        <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    Sign In
                </button>
            </div>
        `;
        // Update count badge
        updateOrderCountBadge(0);
        return;
    }

    let orders = getOrders();

    // Filter
    if (filter !== 'all') {
        if (filter === 'active') {
            orders = orders.filter(o => ['processing', 'shipped', 'on-the-way'].includes(o.status));
        } else if (filter === 'delivered') {
            orders = orders.filter(o => o.status === 'delivered');
        } else if (filter === 'cancelled') {
            orders = orders.filter(o => o.status === 'cancelled');
        }
    }

    if (orders.length === 0) {
        const allOrders = getOrders();
        const emptyMsg = filter === 'all'
            ? "You haven't placed any orders yet. Start shopping to see your orders here!"
            : `No ${filter} orders found.`;

        container.innerHTML = `
            <div class="orders-empty-state">
                <div class="orders-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                </div>
                <h2>${filter === 'all' ? 'No Orders Yet' : 'No ' + filter.charAt(0).toUpperCase() + filter.slice(1) + ' Orders'}</h2>
                <p>${emptyMsg}</p>
                <button class="btn-browse-products" onclick="window.location.href='product.html'">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"/>
                        <polyline points="12 19 5 12 12 5"/>
                    </svg>
                    Browse Products
                </button>
            </div>
        `;
        updateOrderCountBadge(allOrders.length);
        return;
    }

    // Sort orders by date descending (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = orders.map(order => renderOrderCard(order)).join('');

    // Update count badge
    const allOrders = getOrders();
    updateOrderCountBadge(allOrders.length);
}

/* ---- Update count badge ---- */
function updateOrderCountBadge(count) {
    const badge = document.getElementById('orders-count-badge');
    if (badge) {
        badge.textContent = count + ' order' + (count !== 1 ? 's' : '');
    }
}

/* ---- Filter tab handling ---- */
function setActiveFilter(btn, filter) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    renderOrders(filter);
}

/* ---- Re-order: add order items back to cart ---- */
function reorderItems(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    let cart = [];
    try { cart = JSON.parse(localStorage.getItem('gs_cart') || '[]'); }
    catch { cart = []; }

    order.items.forEach(item => {
        const existing = cart.find(c => c.name === item.name);
        if (existing) {
            existing.qty += item.qty;
        } else {
            cart.push({
                name: item.name,
                price: item.price,
                img: item.img,
                qty: item.qty
            });
        }
    });

    const cartJson = JSON.stringify(cart);
    localStorage.setItem('gs_cart', cartJson);
    // Also update the user's personal cart key
    const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    if (user && user.id) {
        localStorage.setItem('gs_cart_' + user.id, cartJson);
    }

    // Show confirmation
    alert('✅ Items from order #' + orderId + ' have been added to your cart!');
    window.location.href = 'cart.html';
}

/* ---- One-time cleanup of old global order data ---- */
function cleanupOldOrderData() {
    // If the old global gs_orders key exists, remove it (it's from before per-user storage)
    if (localStorage.getItem('gs_orders')) {
        localStorage.removeItem('gs_orders');
    }
    // Remove any demo-seeded flags and demo orders for all users
    // so every account starts fresh
    if (!localStorage.getItem('gs_orders_cleanup_done')) {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('gs_demo_seeded_') || key.startsWith('gs_orders_'))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        localStorage.setItem('gs_orders_cleanup_done', '1');
    }
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', function () {
    cleanupOldOrderData();
    renderOrders('all');
});
