/* ============================================================
   AUTH MODULE – SAFE VERSION
   No password storage (prevents phishing flag)
   ============================================================ */

/* ---- Tab Switching ---- */
function switchTab(tab) {
    document.getElementById('tab-signin').classList.toggle('active', tab === 'signin');
    document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');

    document.getElementById('panel-signin').classList.toggle('active', tab === 'signin');
    document.getElementById('panel-signup').classList.toggle('active', tab === 'signup');

    const brand = document.querySelector('.auth-brand');
    if (brand) {
        brand.querySelector('h1').textContent = tab === 'signin' ? 'Welcome Back' : 'Create Account';
        brand.querySelector('p').textContent =
            tab === 'signin'
                ? 'Sign in using your email'
                : 'Create your account (demo mode)';
    }

    hideBanners();
    clearFieldErrors();
}

/* ---- Storage Helpers ---- */
function getUsers() {
    return JSON.parse(localStorage.getItem('gs_users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('gs_users', JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('gs_current_user'));
}

function setCurrentUser(user) {
    localStorage.setItem('gs_current_user', JSON.stringify(user));
}

function logout() {
    localStorage.removeItem('gs_cart');
    localStorage.removeItem('gs_current_user');
    window.location.reload();
}

function isLoggedIn() {
    return !!getCurrentUser();
}

/* ---- UI Messages ---- */
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
    document.getElementById('auth-success-banner')?.classList.remove('visible');
}

function hideError() {
    document.getElementById('auth-error-banner')?.classList.remove('visible');
}

function hideBanners() {
    hideSuccess();
    hideError();
}

/* ---- Validation ---- */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================================
   SIGN UP (NO PASSWORD)
   ============================================================ */
function handleSignUp(e) {
    e.preventDefault();
    clearFieldErrors();
    hideBanners();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const phone = document.getElementById('signup-phone').value.trim();

    if (!name || !email || !phone || !isValidEmail(email)) {
        showError("Please fill all fields correctly.");
        return;
    }

    const users = getUsers();

    if (users.find(u => u.email === email)) {
        showError("User already exists. Please sign in.");
        return;
    }

    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    switchTab('signin');
    showSuccess("Account created! You can now sign in.");
}

/* ============================================================
   SIGN IN (EMAIL ONLY)
   ============================================================ */
function handleSignIn(e) {
    e.preventDefault();
    clearFieldErrors();
    hideBanners();

    const email = document.getElementById('signin-email').value.trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
        showError("Enter valid email.");
        return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        showError("User not found. Please sign up.");
        return;
    }

    setCurrentUser(user);

    showSuccess(`Welcome, ${user.name}! Redirecting...`);

    setTimeout(() => {
        window.location.href = 'product.html';
    }, 1000);
}

/* ============================================================
   AUTO REDIRECT
   ============================================================ */
(function () {
    if (isLoggedIn() && window.location.pathname.includes('login.html')) {
        window.location.href = 'product.html';
    }
})();

/* ============================================================
   NAV USER UI
   ============================================================ */
function initAuthUI() {
    const user = getCurrentUser();
    const nav = document.querySelector('.list-home');
    if (!nav) return;

    const li = document.createElement('li');

    if (user) {
        li.innerHTML = `
            <button onclick="logout()">Logout (${user.name})</button>
        `;
    } else {
        li.innerHTML = `
            <a href="login.html">Sign In</a>
        `;
    }

    nav.appendChild(li);
}

document.addEventListener('DOMContentLoaded', initAuthUI);