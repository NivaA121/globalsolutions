/* ============================================================
   AUTH MODULE – auth.js
   Handles sign-in, sign-up, session management via localStorage.
   Users are stored in localStorage key: gs_users  (array)
   Logged-in user stored in: gs_current_user (object)
   ============================================================ */

/* ---- Tab Switching ---- */
function switchTab(tab) {
    // Tabs
    document.getElementById('tab-signin').classList.toggle('active', tab === 'signin');
    document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');

    // Panels
    document.getElementById('panel-signin').classList.toggle('active', tab === 'signin');
    document.getElementById('panel-signup').classList.toggle('active', tab === 'signup');

    // Update brand text
    const brand = document.querySelector('.auth-brand');
    if (brand) {
        brand.querySelector('h1').textContent = tab === 'signin' ? 'Welcome Back' : 'Create Account';
        brand.querySelector('p').textContent = tab === 'signin'
            ? 'Sign in to your account to continue'
            : 'Join Global Solutions for the best deals';
    }

    // Hide banners
    hideBanners();
    clearFieldErrors();
}

/* ---- Helpers ---- */
function getUsers() {
    try { return JSON.parse(localStorage.getItem('gs_users') || '[]'); }
    catch { return []; }
}

function saveUsers(users) {
    localStorage.setItem('gs_users', JSON.stringify(users));
}

function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem('gs_current_user')); }
    catch { return null; }
}

function setCurrentUser(user) {
    localStorage.setItem('gs_current_user', JSON.stringify(user));
}

function logout() {
    // Clear the shared cart key so the next visitor starts with an empty cart
    localStorage.removeItem('gs_cart');
    localStorage.removeItem('gs_current_user');
    // Close dropdown if on another page
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown) dropdown.classList.remove('open');
    // Refresh current page
    window.location.reload();
}

function isLoggedIn() {
    return !!getCurrentUser();
}

/* ---- Show / Hide Banners ---- */
function showSuccess(msg) {
    const banner = document.getElementById('auth-success-banner');
    const msgEl = document.getElementById('auth-success-msg');
    if (banner && msgEl) {
        msgEl.textContent = msg;
        banner.classList.add('visible');
    }
    hideError();
}

function showError(msg) {
    const banner = document.getElementById('auth-error-banner');
    const msgEl = document.getElementById('auth-error-msg');
    if (banner && msgEl) {
        msgEl.textContent = msg;
        banner.classList.add('visible');
    }
    hideSuccess();
}

function hideSuccess() {
    const banner = document.getElementById('auth-success-banner');
    if (banner) banner.classList.remove('visible');
}

function hideError() {
    const banner = document.getElementById('auth-error-banner');
    if (banner) banner.classList.remove('visible');
}

function hideBanners() {
    hideSuccess();
    hideError();
}

/* ---- Field Error Helpers ---- */
function showFieldError(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('visible');
    // Also add error class to the input
    const inputId = id.replace('-error', '');
    const input = document.getElementById(inputId);
    if (input) input.classList.add('field-error');
}

function hideFieldError(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('visible');
    const inputId = id.replace('-error', '');
    const input = document.getElementById(inputId);
    if (input) input.classList.remove('field-error');
}

function clearFieldErrors() {
    document.querySelectorAll('.field-error-msg').forEach(el => el.classList.remove('visible'));
    document.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
}

/* ---- Password Toggle ---- */
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    // Swap icon
    btn.innerHTML = isPassword
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9 9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
             <line x1="1" y1="1" x2="23" y2="23"/>
           </svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
             <circle cx="12" cy="12" r="3"/>
           </svg>`;
}

/* ---- Password Strength ---- */
function checkPasswordStrength(password) {
    const bars = [
        document.getElementById('str-bar-1'),
        document.getElementById('str-bar-2'),
        document.getElementById('str-bar-3'),
        document.getElementById('str-bar-4')
    ];
    const textEl = document.getElementById('strength-text');
    if (!bars[0] || !textEl) return;

    // Reset
    bars.forEach(b => { b.className = 'strength-bar'; });
    textEl.className = 'strength-text';
    textEl.textContent = '';

    if (!password) return;

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let level, label;
    if (score <= 1) { level = 'weak'; label = 'Weak'; }
    else if (score <= 3) { level = 'medium'; label = 'Medium'; }
    else { level = 'strong'; label = 'Strong'; }

    const fill = level === 'weak' ? 1 : level === 'medium' ? 2 : 4;
    for (let i = 0; i < fill; i++) {
        bars[i].classList.add(level);
    }
    textEl.textContent = label;
    textEl.classList.add(level);
}

/* ---- Email Validation ---- */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================================
   SIGN UP
   ============================================================ */
function handleSignUp(e) {
    e.preventDefault();
    clearFieldErrors();
    hideBanners();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const phone = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;

    let valid = true;

    if (!name) {
        showFieldError('signup-name-error');
        valid = false;
    }
    if (!email || !isValidEmail(email)) {
        showFieldError('signup-email-error');
        valid = false;
    }
    if (!phone || phone.replace(/[\s\+\-]/g, '').length < 10) {
        showFieldError('signup-phone-error');
        valid = false;
    }
    if (!password || password.length < 6) {
        showFieldError('signup-password-error');
        valid = false;
    }
    if (password !== confirm) {
        showFieldError('signup-confirm-error');
        valid = false;
    }

    if (!valid) return;

    // Check if email already exists
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        showError('An account with this email already exists. Please sign in.');
        return;
    }

    // Add loading state
    const btn = document.getElementById('btn-signup');
    btn.classList.add('loading');

    // Simulate network delay
    setTimeout(() => {
        // Save user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            phone,
            password, // In real apps, hash this!
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        saveUsers(users);

        btn.classList.remove('loading');

        // Switch to sign-in tab with success message
        switchTab('signin');
        showSuccess('🎉 Account created successfully! Please sign in.');

        // Pre-fill email
        document.getElementById('signin-email').value = email;
        document.getElementById('signin-password').focus();
    }, 1200);
}

/* ============================================================
   SIGN IN
   ============================================================ */
function handleSignIn(e) {
    e.preventDefault();
    clearFieldErrors();
    hideBanners();

    const email = document.getElementById('signin-email').value.trim().toLowerCase();
    const password = document.getElementById('signin-password').value;

    let valid = true;

    if (!email || !isValidEmail(email)) {
        showFieldError('signin-email-error');
        valid = false;
    }
    if (!password) {
        showFieldError('signin-password-error');
        valid = false;
    }

    if (!valid) return;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    const btn = document.getElementById('btn-signin');
    btn.classList.add('loading');

    setTimeout(() => {
        btn.classList.remove('loading');

        if (!user) {
            showError('Invalid email or password. Please try again.');
            return;
        }

        // Set session
        setCurrentUser({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone
        });

        // Restore this user's personal cart into the shared gs_cart key
        const userCartKey = 'gs_cart_' + user.id;
        const userCart = localStorage.getItem(userCartKey) || '[]';
        localStorage.setItem('gs_cart', userCart);

        showSuccess(`Welcome back, ${user.name.split(' ')[0]}! Redirecting...`);

        // Check if there's a redirect URL
        const redirectUrl = sessionStorage.getItem('gs_redirect_after_login');
        sessionStorage.removeItem('gs_redirect_after_login');

        setTimeout(() => {
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                window.location.href = 'product.html';
            }
        }, 1000);
    }, 1000);
}

/* ============================================================
   AUTO-REDIRECT IF ALREADY LOGGED IN
   ============================================================ */
(function () {
    // If user is already logged in and visits login page, redirect
    if (isLoggedIn() && window.location.pathname.includes('login.html')) {
        const redirectUrl = sessionStorage.getItem('gs_redirect_after_login');
        sessionStorage.removeItem('gs_redirect_after_login');
        window.location.href = redirectUrl || 'product.html';
    }
})();

/* ---- Live error clearing on input ---- */
document.addEventListener('input', function (e) {
    if (e.target.classList.contains('field-error')) {
        e.target.classList.remove('field-error');
        // Find and hide the sibling error message
        const field = e.target.closest('.auth-field');
        if (field) {
            const errMsg = field.querySelector('.field-error-msg');
            if (errMsg) errMsg.classList.remove('visible');
        }
    }
});

/* ============================================================
   HEADER USER MENU — for use on other pages
   Injects user avatar/menu or login link into nav
   ============================================================ */
function initAuthUI() {
    const user = getCurrentUser();
    const navList = document.querySelector('.list-home');
    if (!navList) return;

    // Check if login/user element already exists
    if (document.getElementById('nav-auth-item')) return;

    const li = document.createElement('li');
    li.id = 'nav-auth-item';
    li.style.paddingLeft = '1rem';

    if (user) {
        li.innerHTML = `
            <div class="user-menu-wrap">
                <button class="user-avatar-btn" id="user-avatar-btn" onclick="toggleUserDropdown()" title="${user.name}">
                    <svg class="user-silhouette-icon" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="60" cy="60" r="60" fill="#6b7d9e"/>
                        <circle cx="60" cy="45" r="20" fill="#dce3ed"/>
                        <ellipse cx="60" cy="100" rx="35" ry="25" fill="#dce3ed"/>
                    </svg>
                </button>
                <div class="user-dropdown" id="user-dropdown">
                    <div class="user-dropdown-item" style="pointer-events:none;opacity:0.7;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <div>
                            <div style="font-weight:700;color:#111;">${user.name}</div>
                            <div style="font-size:1.2rem;color:#999;font-weight:400;">${user.email}</div>
                        </div>
                    </div>
                    <div class="user-dropdown-divider"></div>
                    <button class="user-dropdown-item" onclick="window.location.href='my-orders.html'">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                        My Orders
                    </button>
                    <div class="user-dropdown-divider"></div>
                    <button class="user-dropdown-item logout-item" onclick="logout()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Sign Out
                    </button>
                </div>
            </div>
        `;
    } else {
        li.innerHTML = `
            <a href="login.html" style="
                display: inline-flex;
                align-items: center;
                gap: 0.6rem;
                background: linear-gradient(135deg, #115895, #22abeb);
                color: #fff !important;
                padding: 0.8rem 2rem;
                border-radius: 8px;
                font-size: 1.6rem;
                font-weight: 700;
                text-decoration: none;
                transition: all 0.25s;
                white-space: nowrap;
            " onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 16px rgba(17,88,149,0.35)'"
               onmouseout="this.style.transform='';this.style.boxShadow=''">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Sign In
            </a>
        `;
    }

    navList.appendChild(li);

    // Close dropdown on outside click
    document.addEventListener('click', function (e) {
        const dropdown = document.getElementById('user-dropdown');
        const btn = document.getElementById('user-avatar-btn');
        if (dropdown && btn && !btn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.classList.toggle('open');
}

// Auto-init on pages that have the nav (not the login page itself)
if (!window.location.pathname.includes('login.html')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuthUI);
    } else {
        initAuthUI();
    }
}
