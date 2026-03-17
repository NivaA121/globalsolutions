/* ============================================================
   CART PAGE – cart.js
   Reads items from localStorage (gs_cart), renders them,
   and keeps localStorage in sync on every change.
   Step navigation, quantity controls, item removal, coupon.
   ============================================================ */

let currentStep = 1;

/* ---- Helper: read / write localStorage ---- */
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('gs_cart') || '[]');
    } catch { return []; }
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

/* ---- Update header cart badge ---- */
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

/* ============================================================
   RENDER CART ITEMS FROM localStorage
   ============================================================ */
function renderCartItems() {
    const cart = getCart();
    const container = document.getElementById('step-1-content');
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="payment-success">
                <div class="success-icon" style="background: linear-gradient(135deg, #115895, #22abeb);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                </div>
                <h2>Your Cart is Empty</h2>
                <p>Browse our products and add items to your cart.</p>
                <button class="btn-continue-shopping" onclick="window.location.href='product.html'">Browse Products</button>
            </div>
        `;
        recalcSummary();
        return;
    }

    cart.forEach((item, index) => {
        const priceNum = parseFloat(item.price) || 0;
        const originalPrice = Math.round(priceNum * 1.15 / 100) * 100;
        const formattedPrice = '₹' + priceNum.toLocaleString('en-IN');
        const formattedOriginal = originalPrice > priceNum
            ? '₹' + originalPrice.toLocaleString('en-IN')
            : '';

        const cardHTML = `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-img">
                    <img src="${item.img || ''}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-desc">Available at Global Solutions</p>
                    <div class="item-price-row">
                        <span class="item-price">${formattedPrice}</span>
                        ${formattedOriginal ? `<span class="item-price-original">${formattedOriginal}</span>` : ''}
                    </div>
                </div>
                <div class="cart-item-actions">
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="changeQty(this, -1)" aria-label="Decrease quantity">−</button>
                        <span class="qty-value">${item.qty || 1}</span>
                        <button class="qty-btn" onclick="changeQty(this, 1)" aria-label="Increase quantity">+</button>
                    </div>
                    <div class="item-action-btns">
                        <button class="action-btn delete-btn" onclick="removeItem(this)" title="Remove item" aria-label="Remove item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });

    recalcSummary();
}

// ---- Step navigation ----
function nextStep() {
    if (currentStep >= 3) return;

    // AUTH GATE: Check if user is logged in before proceeding to checkout
    if (currentStep === 1) {
        if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
            showLoginModal();
            return;
        }
    }

    // Validate checkout fields before placing order (step 2 → step 3)
    if (currentStep === 2) {
        if (!validateCheckout()) return;
    }

    // Save order to localStorage when placing order (step 2 → step 3)
    if (currentStep === 2) {
        saveOrderToHistory();
    }

    currentStep++;
    updateSteps();

    // Auto-fill checkout fields with user data when entering step 2
    if (currentStep === 2) {
        autoFillCheckoutFromUser();
    }
}

/* ---- Save completed order to order history ---- */
function saveOrderToHistory() {
    const cart = getCart();
    if (cart.length === 0) return;

    const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    const userName = user ? user.name : 'Customer';

    // Get checkout form details
    const address = [
        document.getElementById('checkout-address')?.value || '',
        document.getElementById('checkout-city')?.value || '',
        document.getElementById('checkout-state')?.value || '',
        document.getElementById('checkout-pincode')?.value || ''
    ].filter(Boolean).join(', ');

    const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'card';
    const paymentLabels = { card: 'Debit/Credit Card', upi: 'UPI', cod: 'Cash on Delivery' };

    // Calculate total
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += (parseFloat(item.price) || 0) * (item.qty || 1);
    });
    const discount = Math.round(subtotal * 0.15);
    const codCharge = paymentMethod === 'cod' ? 200 : 0;
    const total = subtotal - discount + codCharge;

    // Estimated delivery date (7 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    const deliveryStr = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });

    const order = {
        id: 'GS-' + Date.now().toString().slice(-6),
        date: new Date().toISOString(),
        status: 'processing',
        statusLabel: 'Processing',
        customerName: userName,
        deliveryDate: deliveryStr,
        deliveryAddress: address || 'Address not specified',
        paymentMethod: paymentLabels[paymentMethod] || 'Card',
        items: cart.map(item => ({
            name: item.name,
            qty: item.qty || 1,
            price: parseFloat(item.price) || 0,
            img: item.img || ''
        })),
        total: total
    };

    // Save to user-specific orders list
    const ordersKey = user ? 'gs_orders_' + user.id : 'gs_orders';
    let orders = [];
    try { orders = JSON.parse(localStorage.getItem(ordersKey) || '[]'); }
    catch { orders = []; }
    orders.unshift(order); // newest first
    localStorage.setItem(ordersKey, JSON.stringify(orders));

    // Clear cart after placing order (both global and user-specific keys)
    localStorage.setItem('gs_cart', JSON.stringify([]));
    if (user && user.id) {
        localStorage.setItem('gs_cart_' + user.id, JSON.stringify([]));
    }
    updateCartBadge();
}

function goToStep(step) {
    if (step < 1 || step > 3) return;
    currentStep = step;
    updateSteps();
}

function updateSteps() {
    // Hide all step content
    document.getElementById('step-1-content').classList.add('hidden');
    document.getElementById('step-2-content').classList.add('hidden');
    document.getElementById('step-3-content').classList.add('hidden');

    // Show current step content
    document.getElementById('step-' + currentStep + '-content').classList.remove('hidden');

    // Update step indicators
    const steps = document.querySelectorAll('.cart-step');
    const lines = document.querySelectorAll('.step-line');

    steps.forEach((s, i) => {
        const stepNum = i + 1;
        s.classList.remove('active', 'completed');
        if (stepNum === currentStep) {
            s.classList.add('active');
        } else if (stepNum < currentStep) {
            s.classList.add('completed');
        }
    });

    lines.forEach((line, i) => {
        if (i + 1 < currentStep) {
            line.classList.add('filled');
        } else {
            line.classList.remove('filled');
        }
    });

    // Update button text based on step
    const btn = document.getElementById('btn-checkout');
    if (currentStep === 1) {
        btn.textContent = 'Proceed to Checkout';
        btn.style.display = 'block';
    } else if (currentStep === 2) {
        btn.textContent = 'Place Order';
        btn.style.display = 'block';
    } else {
        btn.style.display = 'none';
    }

    // Scroll to top on step change
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Allow clicking on step indicators to navigate back
document.querySelectorAll('.cart-step').forEach((stepEl) => {
    stepEl.addEventListener('click', function () {
        const step = parseInt(this.getAttribute('data-step'));
        if (step < currentStep) {
            goToStep(step);
        }
    });
});

// ---- Quantity controls ----
function changeQty(btn, delta) {
    const container = btn.closest('.qty-controls');
    const valueEl = container.querySelector('.qty-value');
    let val = parseInt(valueEl.textContent);
    val = Math.max(1, val + delta);
    valueEl.textContent = val;

    // Add a little scale animation
    valueEl.style.transform = 'scale(1.2)';
    setTimeout(() => { valueEl.style.transform = 'scale(1)'; }, 150);

    // Sync to localStorage
    syncCartFromDOM();
    recalcSummary();
}

// ---- Remove item ----
function removeItem(btn) {
    const item = btn.closest('.cart-item');
    item.classList.add('removing');

    setTimeout(() => {
        item.remove();
        syncCartFromDOM();
        recalcSummary();
        updateCartBadge();

        // If no items left, show empty message
        const remaining = document.querySelectorAll('#step-1-content .cart-item');
        if (remaining.length === 0) {
            renderCartItems(); // will show empty state
        }
    }, 400);
}

/* ---- Sync DOM state back to localStorage ---- */
function syncCartFromDOM() {
    const items = document.querySelectorAll('#step-1-content .cart-item');
    const cart = [];

    items.forEach(item => {
        const name = item.querySelector('.item-name')?.textContent || 'Product';
        const priceText = item.querySelector('.item-price')?.textContent || '₹0';
        const price = parseFloat(priceText.replace(/[₹,]/g, '')) || 0;
        const qty = parseInt(item.querySelector('.qty-value')?.textContent) || 1;
        const img = item.querySelector('.cart-item-img img')?.getAttribute('src') || '';

        cart.push({ name, price, img, qty });
    });

    saveCart(cart);
    updateCartBadge();
}

// ---- Recalculate summary ----
function recalcSummary() {
    const items = document.querySelectorAll('#step-1-content .cart-item');
    let subtotal = 0;

    items.forEach(item => {
        const priceText = item.querySelector('.item-price').textContent;
        const price = parseFloat(priceText.replace(/[₹,]/g, ''));
        const qty = parseInt(item.querySelector('.qty-value').textContent);
        subtotal += price * qty;
    });

    const discount = Math.round(subtotal * 0.15); // 15% discount
    const tax = 0;

    // COD surcharge
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
    const codCharge = (paymentMethod && paymentMethod.value === 'cod') ? 200 : 0;
    const total = subtotal - discount + tax + codCharge;

    document.getElementById('summary-subtotal').textContent = '₹' + subtotal.toLocaleString('en-IN');
    document.getElementById('summary-discount').textContent = '₹' + discount.toLocaleString('en-IN');
    document.getElementById('summary-tax').textContent = '₹0.00';

    const shippingEl = document.getElementById('summary-shipping');
    if (codCharge > 0) {
        shippingEl.textContent = '₹200 (COD)';
        shippingEl.classList.remove('free-tag');
        shippingEl.style.color = '#e05c00';
        shippingEl.style.fontWeight = '700';
    } else {
        shippingEl.textContent = 'Free';
        shippingEl.classList.add('free-tag');
        shippingEl.style.color = '';
        shippingEl.style.fontWeight = '';
    }

    document.getElementById('summary-total').textContent = '₹' + total.toLocaleString('en-IN');

    // Update summary mini items
    const summaryItemsEl = document.getElementById('summary-items');
    summaryItemsEl.innerHTML = '';
    items.forEach(item => {
        const img = item.querySelector('.cart-item-img img').src;
        const name = item.querySelector('.item-name').textContent;
        const priceText = item.querySelector('.item-price').textContent;
        const price = parseFloat(priceText.replace(/[₹,]/g, ''));
        const qty = parseInt(item.querySelector('.qty-value').textContent);

        summaryItemsEl.innerHTML += `
            <div class="summary-item">
                <div class="summary-item-img"><img src="${img}" alt="${name}"></div>
                <div class="summary-item-info">
                    <span class="summary-item-name">${name}</span>
                    <span class="summary-item-meta">Qty: ${qty}</span>
                </div>
                <div class="summary-item-price">
                    <span>₹${(price * qty).toLocaleString('en-IN')}</span>
                    <span class="summary-item-qty">× ${qty}</span>
                </div>
            </div>
        `;
    });
}

// ---- Coupon ----
function applyCoupon() {
    const input = document.getElementById('coupon-code');
    const code = input.value.trim().toUpperCase();

    if (code === 'GLOBAL20') {
        // Apply 20% extra discount
        alert('🎉 Coupon "GLOBAL20" applied! 20% extra discount.');
        input.style.borderColor = '#22ab5b';
    } else if (code === '') {
        alert('Please enter a coupon code.');
    } else {
        alert('Invalid coupon code. Try "GLOBAL20".');
        input.style.borderColor = '#e05c00';
    }
}

// ---- Payment method toggle ----
document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
    radio.addEventListener('change', function () {
        document.querySelectorAll('.payment-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        this.closest('.payment-option').classList.add('selected');

        const cardFields = document.getElementById('card-fields');
        const codInfo = document.getElementById('cod-info');
        const method = this.value;

        // Show/hide card fields
        if (method === 'card') {
            cardFields.classList.remove('collapsed');
            codInfo.classList.add('hidden');
        } else {
            cardFields.classList.add('collapsed');
            if (method === 'cod') {
                codInfo.classList.remove('hidden');
            } else {
                codInfo.classList.add('hidden');
            }
        }

        // Recalculate total for COD surcharge
        recalcSummary();
    });
});

// ---- Checkout Form Validation ----
function validateCheckout() {
    const step2 = document.getElementById('step-2-content');
    const selectedPayment = document.querySelector('input[name="payment-method"]:checked').value;
    const cardFieldsEl = document.getElementById('card-fields');

    // Skip card field inputs if UPI or COD is selected
    let requiredInputs;
    if (selectedPayment === 'card') {
        requiredInputs = step2.querySelectorAll('input[required], select[required]');
    } else {
        const allRequired = step2.querySelectorAll('input[required], select[required]');
        requiredInputs = Array.from(allRequired).filter(el => !cardFieldsEl.contains(el));
    }

    const banner = document.getElementById('checkout-error-banner');
    let valid = true;
    let firstInvalid = null;

    // Clear all previous error states
    requiredInputs.forEach(input => {
        input.classList.remove('input-error');
    });

    // Check each required field
    requiredInputs.forEach(input => {
        let isEmpty = false;

        if (input.tagName === 'SELECT') {
            isEmpty = !input.value;
        } else if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isEmpty = !input.value.trim() || !emailRegex.test(input.value.trim());
        } else if (input.type === 'tel') {
            isEmpty = !input.value.trim() || input.value.replace(/[\s\+\-]/g, '').length < 10;
        } else {
            isEmpty = !input.value.trim();
        }

        if (isEmpty) {
            input.classList.add('input-error');
            valid = false;
            if (!firstInvalid) firstInvalid = input;
        }
    });

    if (!valid) {
        banner.classList.remove('hidden');
        banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            if (firstInvalid) firstInvalid.focus();
        }, 400);
    } else {
        banner.classList.add('hidden');
    }

    return valid;
}

// Live clear error state when user types or changes a field
document.addEventListener('input', function (e) {
    if (e.target.classList.contains('input-error')) {
        e.target.classList.remove('input-error');
        const remaining = document.querySelectorAll('#step-2-content .input-error');
        if (remaining.length === 0) {
            document.getElementById('checkout-error-banner').classList.add('hidden');
        }
    }
});
document.addEventListener('change', function (e) {
    if (e.target.classList.contains('input-error')) {
        e.target.classList.remove('input-error');
        const remaining = document.querySelectorAll('#step-2-content .input-error');
        if (remaining.length === 0) {
            document.getElementById('checkout-error-banner').classList.add('hidden');
        }
    }
});

// ---- Boot: render items from localStorage ----
renderCartItems();
updateCartBadge();

/* ============================================================
   LOGIN MODAL FUNCTIONS
   ============================================================ */
function showLoginModal() {
    const overlay = document.getElementById('login-modal-overlay');
    if (overlay) {
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }
}

function closeLoginModal() {
    const overlay = document.getElementById('login-modal-overlay');
    if (overlay) {
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
    }
}

function redirectToLogin() {
    // Save current page so user is redirected back after login
    sessionStorage.setItem('gs_redirect_after_login', 'cart.html');
    window.location.href = 'login.html';
}

// Close modal on overlay click (outside the card)
document.getElementById('login-modal-overlay')?.addEventListener('click', function (e) {
    if (e.target === this) closeLoginModal();
});

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLoginModal();
});

/* ============================================================
   AUTO-FILL CHECKOUT FROM USER PROFILE
   ============================================================ */
function autoFillCheckoutFromUser() {
    if (typeof getCurrentUser !== 'function') return;
    const user = getCurrentUser();
    if (!user) return;

    // Split name into first and last
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const fnField = document.getElementById('checkout-firstname');
    const lnField = document.getElementById('checkout-lastname');
    const emailField = document.getElementById('checkout-email');
    const phoneField = document.getElementById('checkout-phone');

    if (fnField && !fnField.value) fnField.value = firstName;
    if (lnField && !lnField.value) lnField.value = lastName;
    if (emailField && !emailField.value) emailField.value = user.email || '';
    if (phoneField && (!phoneField.value || phoneField.value === '+91 ')) {
        phoneField.value = user.phone || '+91 ';
    }
}
