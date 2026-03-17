/* ============================================================
   ADD TO CART – add-to-cart.js
   Shared across all product listing pages.
   Uses localStorage so the cart persists between pages.
   ============================================================ */

// ---- Initialise cart from localStorage ----
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('gs_cart') || '[]');
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('gs_cart', JSON.stringify(cart));
    // Also persist to the logged-in user's personal cart slot
    if (typeof getCurrentUser === 'function') {
        const user = getCurrentUser();
        if (user && user.id) {
            localStorage.setItem('gs_cart_' + user.id, JSON.stringify(cart));
        }
    }
}

// ---- Update badge in header ----
function updateCartBadge() {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    const badges = document.querySelectorAll('.nav-cart-badge');
    badges.forEach(badge => {
        if (totalQty > 0) {
            badge.textContent = totalQty;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

// ---- Add item to cart ----
function addToCart(btn) {
    const card = btn.closest('.pl-card');
    if (!card) return;

    const name = card.querySelector('.pl-card-name')?.textContent?.trim() || 'Product';
    const priceText = card.querySelector('.pl-card-price')?.textContent?.trim() || '₹0';
    const price = parseFloat(priceText.replace(/[₹,]/g, '')) || 0;
    const img = card.querySelector('.pl-img-wrap img')?.getAttribute('src') || '';

    const cart = getCart();

    // Check if already in cart by name
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty = (existing.qty || 1) + 1;
    } else {
        cart.push({ name, price, img, qty: 1 });
    }

    saveCart(cart);
    updateCartBadge();

    // ---- Button feedback ----
    const originalHTML = btn.innerHTML;
    btn.classList.add('added');
    btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
        Added!
    `;

    setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = originalHTML;
    }, 1600);

    // ---- Toast notification ----
    showCartToast(name);
}

// ---- Toast ----
function showCartToast(productName) {
    // Remove any existing toasts
    document.querySelectorAll('.cart-toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="9 12 11.5 14.5 16 9.5"/>
        </svg>
        <span><strong>${productName}</strong> added to cart</span>
    `;
    document.body.appendChild(toast);

    // Auto-remove after animation completes
    setTimeout(() => {
        toast.remove();
    }, 2800);
}

// ---- Add item from Product Detail page ----
function addToCartFromDetail(btn) {
    let product;
    try {
        product = JSON.parse(localStorage.getItem('gs_selected_product') || 'null');
    } catch { product = null; }

    if (!product) return;

    const name = product.name || 'Product';
    const price = parseFloat(String(product.price).replace(/[₹,]/g, '')) || 0;
    const img = product.imgSrc || '';

    const cart = getCart();

    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty = (existing.qty || 1) + 1;
    } else {
        cart.push({ name, price, img, qty: 1 });
    }

    saveCart(cart);
    updateCartBadge();

    // ---- Button feedback ----
    const originalHTML = btn.innerHTML;
    btn.classList.add('added');
    btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
        Added!
    `;

    setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = originalHTML;
    }, 1600);

    // ---- Toast notification ----
    showCartToast(name);
}

// ---- Run on page load ----
document.addEventListener('DOMContentLoaded', updateCartBadge);
