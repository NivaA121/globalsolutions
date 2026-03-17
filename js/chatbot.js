/* =============================================
   CHATBOT ENGINE – Global Solutions
   Smart Product-Aware Assistant
   ============================================= */

(function () {
    'use strict';

    /* -------- PRODUCT KNOWLEDGE BASE -------- */
    const PRODUCTS = [
        // Logitech – Mouse
        { name: 'Logitech MX Master 3', price: 8995, brand: 'Logitech', category: 'mouse', tags: ['wireless', 'ergonomic', 'bluetooth', 'popular'], page: 'logitech_mice.html' },
        { name: 'Logitech M720 Triathlon', price: 5995, brand: 'Logitech', category: 'mouse', tags: ['wireless', 'multi-device', 'bluetooth'], page: 'logitech_mice.html' },
        { name: 'Logitech G Pro X Superlight', price: 12995, brand: 'Logitech', category: 'mouse', tags: ['gaming', 'wireless', 'lightweight', 'new'], page: 'logitech_mice.html' },
        { name: 'Logitech M330 Silent Plus', price: 1695, brand: 'Logitech', category: 'mouse', tags: ['silent', 'wireless'], page: 'logitech_mice.html' },
        { name: 'Logitech M185 Wireless', price: 795, brand: 'Logitech', category: 'mouse', tags: ['wireless', 'budget', 'popular'], page: 'logitech_mice.html' },
        { name: 'Logitech MX Anywhere 3', price: 4495, brand: 'Logitech', category: 'mouse', tags: ['wireless', 'compact', 'travel'], page: 'logitech_mice.html' },

        // Logitech – Keyboard
        { name: 'Logitech MX Keys', price: 9995, brand: 'Logitech', category: 'keyboard', tags: ['wireless', 'backlit', 'smart', 'popular'], page: 'logitech_keyboard.html' },
        { name: 'Logitech K380', price: 2795, brand: 'Logitech', category: 'keyboard', tags: ['bluetooth', 'multi-device', 'compact'], page: 'logitech_keyboard.html' },
        { name: 'Logitech G915 TKL', price: 17495, brand: 'Logitech', category: 'keyboard', tags: ['gaming', 'mechanical', 'wireless', 'new'], page: 'logitech_keyboard.html' },
        { name: 'Logitech K120', price: 595, brand: 'Logitech', category: 'keyboard', tags: ['wired', 'budget'], page: 'logitech_keyboard.html' },
        { name: 'Logitech K850 Performance BT', price: 5495, brand: 'Logitech', category: 'keyboard', tags: ['bluetooth', 'wireless', 'ergonomic'], page: 'logitech_keyboard.html' },

        // Logitech – Webcam
        { name: 'Logitech Brio 4K', price: 15995, brand: 'Logitech', category: 'webcam', tags: ['4k', 'hdr', 'streaming', 'popular'], page: 'logitech_webcam.html' },
        { name: 'Logitech C920s HD Pro', price: 7995, brand: 'Logitech', category: 'webcam', tags: ['1080p', 'privacy-shutter'], page: 'logitech_webcam.html' },
        { name: 'Logitech C505 HD', price: 3495, brand: 'Logitech', category: 'webcam', tags: ['720p', 'budget'], page: 'logitech_webcam.html' },
        { name: 'Logitech C270 HD', price: 1895, brand: 'Logitech', category: 'webcam', tags: ['720p', 'budget'], page: 'logitech_webcam.html' },

        // Lapcare – Keyboard & Mouse
        { name: 'Lapcare Wired Combo', price: 699, brand: 'Lapcare', category: 'keyboard & mouse', tags: ['wired', 'combo', 'budget'], page: 'lapcare_keymouse.html' },
        { name: 'Lapcare Wireless Combo', price: 1299, brand: 'Lapcare', category: 'keyboard & mouse', tags: ['wireless', 'combo'], page: 'lapcare_keymouse.html' },
        { name: 'Lapcare BT Combo', price: 1999, brand: 'Lapcare', category: 'keyboard & mouse', tags: ['bluetooth', 'combo'], page: 'lapcare_keymouse.html' },
        { name: 'Lapcare Basic Combo', price: 499, brand: 'Lapcare', category: 'keyboard & mouse', tags: ['wired', 'budget', 'combo'], page: 'lapcare_keymouse.html' },

        // Lapcare – Charger
        { name: 'Lapcare Dell Charger 65W', price: 1299, brand: 'Lapcare', category: 'charger', tags: ['dell', '65w'], page: 'lapcare_charger.html' },
        { name: 'Lapcare HP Charger 45W', price: 999, brand: 'Lapcare', category: 'charger', tags: ['hp', '45w'], page: 'lapcare_charger.html' },
        { name: 'Lapcare Lenovo Charger 90W', price: 1599, brand: 'Lapcare', category: 'charger', tags: ['lenovo', '90w'], page: 'lapcare_charger.html' },
        { name: 'Lapcare Asus Charger 45W', price: 1099, brand: 'Lapcare', category: 'charger', tags: ['asus', '45w'], page: 'lapcare_charger.html' },
        { name: 'Lapcare Universal Charger', price: 1799, brand: 'Lapcare', category: 'charger', tags: ['universal', 'multi'], page: 'lapcare_charger.html' },

        // Lapcare – Adapter
        { name: 'Lapcare HDMI Adapter', price: 499, brand: 'Lapcare', category: 'adapter', tags: ['hdmi'], page: 'lapcare_adapter.html' },
        { name: 'Lapcare USB-C to USB-A', price: 399, brand: 'Lapcare', category: 'adapter', tags: ['usb-c', 'usb'], page: 'lapcare_adapter.html' },
        { name: 'Lapcare VGA Adapter', price: 599, brand: 'Lapcare', category: 'adapter', tags: ['vga'], page: 'lapcare_adapter.html' },
        { name: 'Lapcare 7-in-1 Hub', price: 1999, brand: 'Lapcare', category: 'adapter', tags: ['hub', 'multiport', 'popular'], page: 'lapcare_adapter.html' },
        { name: 'Lapcare Micro USB OTG', price: 199, brand: 'Lapcare', category: 'adapter', tags: ['otg', 'budget'], page: 'lapcare_adapter.html' },

        // Lapcare – Webcam
        { name: 'Lapcare 1080p Webcam', price: 2499, brand: 'Lapcare', category: 'webcam', tags: ['1080p', 'popular'], page: 'lapcare_webcam.html' },
        { name: 'Lapcare 720p Webcam', price: 1299, brand: 'Lapcare', category: 'webcam', tags: ['720p', 'budget'], page: 'lapcare_webcam.html' },
        { name: 'Lapcare Webcam with Ring Light', price: 3499, brand: 'Lapcare', category: 'webcam', tags: ['ring-light', '1080p', 'new'], page: 'lapcare_webcam.html' },
        { name: 'Lapcare Basic Webcam', price: 899, brand: 'Lapcare', category: 'webcam', tags: ['basic', 'budget'], page: 'lapcare_webcam.html' },

        // Lapcare – Monitor
        { name: 'Lapcare 21.5 inch Monitor', price: 7999, brand: 'Lapcare', category: 'monitor', tags: ['21.5"', 'full-hd', 'popular'], page: 'lapcare_monitor.html' },
        { name: 'Lapcare 24 inch Monitor', price: 10999, brand: 'Lapcare', category: 'monitor', tags: ['24"', 'full-hd'], page: 'lapcare_monitor.html' },
        { name: 'Lapcare 27 inch QHD Monitor', price: 18999, brand: 'Lapcare', category: 'monitor', tags: ['27"', 'qhd', '2k', 'new'], page: 'lapcare_monitor.html' },
        { name: 'Lapcare 18.5 inch HD Monitor', price: 5999, brand: 'Lapcare', category: 'monitor', tags: ['18.5"', 'hd', 'budget'], page: 'lapcare_monitor.html' },

        // Lapcare – Battery
        { name: 'Lapcare Dell 6-Cell Battery', price: 2499, brand: 'Lapcare', category: 'battery', tags: ['dell', '6-cell'], page: 'lapcare_battery.html' },
        { name: 'Lapcare HP 4-Cell Battery', price: 1999, brand: 'Lapcare', category: 'battery', tags: ['hp', '4-cell'], page: 'lapcare_battery.html' },
        { name: 'Lapcare Lenovo 6-Cell Battery', price: 2699, brand: 'Lapcare', category: 'battery', tags: ['lenovo', '6-cell'], page: 'lapcare_battery.html' },
        { name: 'Lapcare Asus Long-Life Battery', price: 2899, brand: 'Lapcare', category: 'battery', tags: ['asus', 'long-life', 'new'], page: 'lapcare_battery.html' },
        { name: 'Lapcare Acer 6-Cell Battery', price: 2299, brand: 'Lapcare', category: 'battery', tags: ['acer', '6-cell'], page: 'lapcare_battery.html' },
        { name: 'Lapcare Universal Battery Pack', price: 3499, brand: 'Lapcare', category: 'battery', tags: ['universal'], page: 'lapcare_battery.html' },

        // Lapcare – Toner / Cartridges
        { name: 'HP LaserJet Black Toner', price: 2999, brand: 'Lapcare', category: 'toner', tags: ['hp', 'laser', 'popular'], page: 'lapcare_toner.html' },
        { name: 'Canon PG-745 Black Cartridge', price: 899, brand: 'Lapcare', category: 'toner', tags: ['canon', 'inkjet'], page: 'lapcare_toner.html' },
        { name: 'Epson 001 Ink Bottle Combo', price: 1299, brand: 'Lapcare', category: 'toner', tags: ['epson', 'ink-bottle'], page: 'lapcare_toner.html' },
        { name: 'Brother TN-1000 Toner', price: 1799, brand: 'Lapcare', category: 'toner', tags: ['brother', 'laser'], page: 'lapcare_toner.html' },
        { name: 'HP 678 Cartridge Combo Pack', price: 1599, brand: 'Lapcare', category: 'toner', tags: ['hp', 'combo', 'inkjet'], page: 'lapcare_toner.html' },

        // Lapcare – CPU Fan
        { name: 'Lapcare Dell CPU Cooling Fan', price: 899, brand: 'Lapcare', category: 'cpu fan', tags: ['dell', 'cooling'], page: 'lapcare_cpufan.html' },
        { name: 'Lapcare HP CPU Cooling Fan', price: 799, brand: 'Lapcare', category: 'cpu fan', tags: ['hp', 'cooling'], page: 'lapcare_cpufan.html' },
        { name: 'Lapcare Lenovo CPU Fan', price: 999, brand: 'Lapcare', category: 'cpu fan', tags: ['lenovo', 'cooling'], page: 'lapcare_cpufan.html' },
        { name: 'Lapcare Universal Laptop Cooler', price: 1499, brand: 'Lapcare', category: 'cpu fan', tags: ['universal', 'cooler', 'popular'], page: 'lapcare_cpufan.html' },

        // Lapcare – UPS
        { name: 'Lapcare 600VA Line Interactive', price: 2999, brand: 'Lapcare', category: 'ups', tags: ['600va', 'line-interactive', 'popular'], page: 'lapcare_ups.html' },
        { name: 'Lapcare 800VA Smart UPS', price: 3799, brand: 'Lapcare', category: 'ups', tags: ['800va', 'smart'], page: 'lapcare_ups.html' },
        { name: 'Lapcare 1000VA Online UPS', price: 5999, brand: 'Lapcare', category: 'ups', tags: ['1000va', 'online', 'new'], page: 'lapcare_ups.html' },
        { name: 'Lapcare 1500VA Tower UPS', price: 7999, brand: 'Lapcare', category: 'ups', tags: ['1500va', 'tower'], page: 'lapcare_ups.html' },
        { name: 'Lapcare Mini UPS for Router', price: 1599, brand: 'Lapcare', category: 'ups', tags: ['mini', 'router', 'budget'], page: 'lapcare_ups.html' },

        // Fingers – Earphones
        { name: 'Fingers Hi-Bass Wired Earphones', price: 699, brand: 'Fingers', category: 'earphones', tags: ['wired', 'bass', 'popular'], page: 'fingers_earphones.html' },
        { name: 'Fingers Bluetooth Neckband', price: 1299, brand: 'Fingers', category: 'earphones', tags: ['bluetooth', 'wireless', 'neckband'], page: 'fingers_earphones.html' },
        { name: 'Fingers TWS True Wireless Buds', price: 2499, brand: 'Fingers', category: 'earphones', tags: ['tws', 'wireless', 'new'], page: 'fingers_earphones.html' },
        { name: 'Fingers Basic In-Ear Earphones', price: 399, brand: 'Fingers', category: 'earphones', tags: ['wired', 'budget', 'basic'], page: 'fingers_earphones.html' },
        { name: 'Fingers Sports Running Earphones', price: 999, brand: 'Fingers', category: 'earphones', tags: ['sports', 'running', 'sweatproof'], page: 'fingers_earphones.html' },

        // Fingers – Headset
        { name: 'Fingers Over-Ear Stereo Headset', price: 1499, brand: 'Fingers', category: 'headset', tags: ['over-ear', 'stereo', 'popular'], page: 'fingers_headset.html' },
        { name: 'Fingers On-Ear Headset w/ Mic', price: 999, brand: 'Fingers', category: 'headset', tags: ['on-ear', 'mic'], page: 'fingers_headset.html' },
        { name: 'Fingers Wireless Headset BT5.0', price: 2999, brand: 'Fingers', category: 'headset', tags: ['wireless', 'bluetooth', 'new'], page: 'fingers_headset.html' },
        { name: 'Fingers Budget USB Headset', price: 599, brand: 'Fingers', category: 'headset', tags: ['usb', 'budget'], page: 'fingers_headset.html' },
        { name: 'Fingers Gaming Headset RGB', price: 1999, brand: 'Fingers', category: 'headset', tags: ['gaming', 'rgb', 'usb'], page: 'fingers_headset.html' },

        // Fingers – Speakers
        { name: 'Fingers Desktop Speakers 2.0', price: 1299, brand: 'Fingers', category: 'speakers', tags: ['desktop', '2.0', 'popular'], page: 'fingers_speakers.html' },
        { name: 'Fingers Bluetooth Portable Speaker', price: 2499, brand: 'Fingers', category: 'speakers', tags: ['bluetooth', 'portable'], page: 'fingers_speakers.html' },
        { name: 'Fingers 2.1 Multimedia Speaker', price: 3999, brand: 'Fingers', category: 'speakers', tags: ['2.1', 'subwoofer', 'new'], page: 'fingers_speakers.html' },
        { name: 'Fingers Mini USB Speaker', price: 799, brand: 'Fingers', category: 'speakers', tags: ['mini', 'usb', 'budget'], page: 'fingers_speakers.html' },
        { name: 'Fingers Home Theater Speaker', price: 5999, brand: 'Fingers', category: 'speakers', tags: ['home-theater', '5.1', 'premium'], page: 'fingers_speakers.html' },

        // Fingers – Peripherals
        { name: 'Fingers 4-Port USB 3.0 Hub', price: 899, brand: 'Fingers', category: 'peripherals', tags: ['usb-hub', 'usb-3.0', 'popular'], page: 'fingers_peripherals.html' },
        { name: 'Fingers All-in-One Card Reader', price: 499, brand: 'Fingers', category: 'peripherals', tags: ['card-reader', 'multi-format'], page: 'fingers_peripherals.html' },
        { name: 'Fingers XL Gaming Mousepad', price: 299, brand: 'Fingers', category: 'peripherals', tags: ['mousepad', 'gaming', 'xl'], page: 'fingers_peripherals.html' },
        { name: 'Fingers Adjustable Laptop Stand', price: 1499, brand: 'Fingers', category: 'peripherals', tags: ['laptop-stand', 'adjustable', 'new'], page: 'fingers_peripherals.html' },
        { name: 'Fingers 7-in-1 USB-C Hub', price: 699, brand: 'Fingers', category: 'peripherals', tags: ['usb-c', 'hub'], page: 'fingers_peripherals.html' },

        // Fingers – Mic
        { name: 'Fingers USB Desktop Mic', price: 999, brand: 'Fingers', category: 'mic', tags: ['usb', 'desktop', 'popular'], page: 'fingers_mic.html' },
        { name: 'Fingers Condenser Studio Mic', price: 2999, brand: 'Fingers', category: 'mic', tags: ['condenser', 'studio', 'recording', 'new'], page: 'fingers_mic.html' },
        { name: 'Fingers Clip-On Lavalier Mic', price: 699, brand: 'Fingers', category: 'mic', tags: ['lavalier', 'clip-on', 'vlogging'], page: 'fingers_mic.html' },
        { name: 'Fingers Conference Mic', price: 3999, brand: 'Fingers', category: 'mic', tags: ['conference', '360-degree', 'usb'], page: 'fingers_mic.html' },
    ];

    const BRANDS = ['Logitech', 'Lapcare', 'Fingers'];
    const CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))];

    /* -------- COMPANY INFO -------- */
    const COMPANY = {
        name: 'Global Solutions',
        phone: '9998020110',
        email: 'info@globalsolutions.ind.in',
        address: 'A-132 Populer Plaza, Someshwara Complex-1, Near Shyamal Char Rasta, Ahmedabad, Gujarat 380015',
        brands: 'Logitech, Lapcare, Fingers',
        services: 'Computer Sale & Service, IT Infrastructure, System Integration, Telecom Solutions, Networking, CCTV, UPS Solutions',
    };

    /* -------- GREETING MESSAGES -------- */
    const GREETINGS = [
        `👋 Hey there! Welcome to **Global Solutions**.\nI'm your AI assistant. I can help you with:\n\n• 🛒 Product info & pricing\n• 🔍 Finding the right product\n• ℹ️ Company information\n\nHow can I help you today?`,
    ];

    /* -------- UTILITY -------- */
    function fmt(n) {
        return '₹' + n.toLocaleString('en-IN');
    }

    function escHtml(s) {
        const d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    function bold(text) {
        return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    }

    function nl2br(text) {
        return text.replace(/\n/g, '<br>');
    }

    function renderText(text) {
        return nl2br(bold(escHtml(text)));
    }

    /* -------- NLP-LITE HELPERS -------- */
    function normalize(s) {
        return s.toLowerCase().replace(/[^a-z0-9₹ ]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function includesAny(text, words) {
        const t = normalize(text);
        return words.some(w => {
            // For multi-word phrases, use simple includes
            if (w.includes(' ')) return t.includes(w);
            // For single words, use word-boundary start + prefix matching
            // This handles plurals (discount → discounts), tenses (order → ordering), etc.
            const regex = new RegExp('(^|\\s)' + w + '\\w*($|\\s)');
            return regex.test(t);
        });
    }

    function extractBudget(text) {
        const t = normalize(text);
        const m = t.match(/(?:under|below|within|less than|upto|up to|max|budget|around|range)\s*₹?\s*(\d+)/);
        if (m) return parseInt(m[1], 10);
        const m2 = t.match(/(\d+)\s*(?:rs|rupees|inr|₹)/);
        if (m2) return parseInt(m2[1], 10);
        return null;
    }

    // Stop words to ignore in product search
    const STOP_WORDS = new Set([
        'a', 'an', 'the', 'is', 'it', 'in', 'on', 'at', 'to', 'of', 'or', 'and',
        'for', 'do', 'does', 'did', 'can', 'you', 'your', 'we', 'me', 'my', 'i',
        'am', 'are', 'was', 'be', 'has', 'have', 'had', 'not', 'no', 'so',
        'if', 'but', 'with', 'from', 'by', 'as', 'this', 'that', 'what', 'which',
        'how', 'any', 'all', 'some', 'get', 'got', 'give', 'show', 'find',
        'want', 'need', 'looking', 'look', 'please', 'could', 'would', 'should',
        'tell', 'know', 'about', 'there', 'here', 'also', 'just', 'very', 'its',
    ]);

    function findProducts(query) {
        const q = normalize(query);
        const words = q.split(' ').filter(w => w.length >= 3 && !STOP_WORDS.has(w));

        if (words.length === 0) return [];

        return PRODUCTS.map(p => {
            let score = 0;
            const hayParts = (p.name + ' ' + p.brand + ' ' + p.category + ' ' + p.tags.join(' ')).toLowerCase().split(/[\s\-]+/);
            const hay = hayParts.join(' ');

            words.forEach(w => {
                // Exact word match in any part (highest value)
                if (hayParts.some(part => part === w)) {
                    score += 4;
                }
                // Word starts with the search term (partial match, e.g. "ear" matches "earphones")
                else if (hayParts.some(part => part.startsWith(w) && w.length >= 3)) {
                    score += 2;
                }
                // Search term starts with a hay word (e.g. "earphones" query matches "ear" tag — unlikely but safe)
                else if (hayParts.some(part => w.startsWith(part) && part.length >= 3)) {
                    score += 1;
                }
            });

            // Bonus for exact category match
            if (q.includes(p.category)) score += 5;
            // Bonus for brand match
            BRANDS.forEach(b => { if (q.includes(b.toLowerCase()) && p.brand === b) score += 6; });
            return { ...p, score };
        }).filter(p => p.score > 0).sort((a, b) => b.score - a.score);
    }

    function productCard(p) {
        return `<div class="chatbot-product-card"><p class="cb-prod-name">${escHtml(p.name)}</p><p class="cb-prod-price">${fmt(p.price)}</p><a class="cb-prod-link" href="${p.page}">View Product →</a></div>`;
    }

    /* -------- RESPONSE ENGINE -------- */
    function getResponse(userMsg) {
        const q = normalize(userMsg);
        const original = userMsg;
        const wordCount = q.split(' ').filter(w => w.length > 0).length;

        // === EARLY GREETING: Short messages that are clearly greetings ===
        const greetingWords = ['hi', 'hello', 'hey', 'howdy', 'hola', 'good morning', 'good afternoon', 'good evening'];
        if (wordCount <= 3 && includesAny(q, greetingWords)) {
            return {
                text: `Hello! 😊 Welcome to Global Solutions. How can I assist you today?`,
                quickReplies: ['Show products', 'Best sellers', 'Company info', 'Contact details'],
            };
        }

        // === EARLY THANKS/BYE: Short farewell messages ===
        if (wordCount <= 4 && includesAny(q, ['thank', 'thanks', 'bye', 'goodbye', 'see you', 'take care'])) {
            return {
                text: `You're welcome! 😊 Feel free to reach out anytime. Happy shopping! 🛍️`,
            };
        }

        // === HIGH-PRIORITY: Budget with amount (check first to catch "under 1500" queries) ===
        const budgetAmount = extractBudget(userMsg);
        if (budgetAmount) {
            // Also filter by category/brand if mentioned
            let pool = PRODUCTS.filter(p => p.price <= budgetAmount);
            const prodMatches = findProducts(userMsg);
            if (prodMatches.length > 0) {
                // Intersect: products that match keywords AND are within budget
                const matchNames = new Set(prodMatches.map(p => p.name));
                const intersected = pool.filter(p => matchNames.has(p.name));
                if (intersected.length > 0) pool = intersected;
            }
            pool.sort((a, b) => b.price - a.price);
            const top = pool.slice(0, 5);
            if (top.length === 0) {
                return { text: `😕 Sorry, I couldn't find products under ${fmt(budgetAmount)}. Our most affordable product is the **${PRODUCTS.reduce((a, b) => a.price < b.price ? a : b).name}** at ${fmt(PRODUCTS.reduce((a, b) => a.price < b.price ? a : b).price)}.`, quickReplies: ['Budget options', 'Show all products'] };
            }
            let text = `Here are products under **${fmt(budgetAmount)}:**\n`;
            let cards = top.map(p => productCard(p)).join('');
            return { text, cards, quickReplies: ['Best sellers', 'New arrivals'] };
        }

        // === PAYMENT (check before product search since 'pay' could match product names) ===
        if (includesAny(q, ['payment', 'payment method', 'pay', 'cod', 'cash on delivery', 'upi', 'debit', 'credit'])) {
            return {
                text: `💳 We accept the following payment methods:\n\n• **Debit/Credit Card**\n• **UPI** (Google Pay, PhonePe, etc.)\n• **Cash on Delivery** (+₹200 surcharge)\n\nAll payments are processed securely.`,
                quickReplies: ['Shipping info', 'Show products'],
            };
        }

        // === SHIPPING / DELIVERY ===
        if (includesAny(q, ['shipping', 'delivery', 'ship', 'deliver', 'free shipping'])) {
            return {
                text: `🚚 We offer **free shipping** on all orders!\n\n📦 Estimated delivery is within **7-10 business days** depending on your location.\n\nYou can track your order via the order confirmation email.`,
                quickReplies: ['Show products', 'Payment methods'],
            };
        }

        // === RETURN / REFUND ===
        if (includesAny(q, ['return', 'refund', 'exchange', 'warranty', 'guarantee'])) {
            return {
                text: `🔄 **Returns & Warranty:**\n\n• Products come with manufacturer warranty\n• Returns accepted within 7 days of delivery\n• Refund processed within 5-7 business days\n\nFor specific warranty queries, please contact us at ${COMPANY.phone}.`,
                quickReplies: ['Contact details', 'Show products'],
            };
        }

        // === COMPANY INFO ===
        if (includesAny(q, ['company', 'about', 'who are', 'what is global', 'about global', 'tell me about'])) {
            return {
                text: `**Global Solutions** is an authorized retailer of premium computer products & IT solutions based in Ahmedabad, Gujarat.\n\n🏢 **Brands we carry:** ${COMPANY.brands}\n\n💼 **Services:** ${COMPANY.services}\n\n📍 **Address:** ${COMPANY.address}`,
                quickReplies: ['View products', 'Contact details', 'Show brands'],
            };
        }

        // === CONTACT ===
        if (includesAny(q, ['contact', 'phone', 'call', 'email', 'address', 'location', 'reach'])) {
            return {
                text: `📞 **Phone:** ${COMPANY.phone}\n📧 **Email:** ${COMPANY.email}\n📍 **Address:** ${COMPANY.address}\n\nYou can also visit our Contact Us page for more details!`,
                quickReplies: ['Show products', 'Company info'],
            };
        }

        // === BRANDS ===
        if (includesAny(q, ['brand', 'brands', 'which brand', 'all brands', 'show brands'])) {
            return {
                text: `We are authorized retailers for these premium brands:\n\n🔵 **Logitech** – Mouse, Keyboard, Webcam\n🟢 **Lapcare** – Chargers, Batteries, Monitors, Adapters, UPS, CPU Fans, Webcams, Toners, Keyboard & Mouse\n🟠 **Fingers** – Earphones, Headsets, Speakers, Peripherals, Microphones`,
                quickReplies: ['Logitech products', 'Lapcare products', 'Fingers products'],
            };
        }

        // === PRODUCT SEARCH (general keyword matching) — runs BEFORE intent tags ===
        // This ensures "best webcam", "top keyboard", "new earphones" etc. find actual products
        const matches = findProducts(userMsg);
        if (matches.length > 0) {
            const top = matches.slice(0, 5);
            let text = `I found **${matches.length} product${matches.length > 1 ? 's' : ''}** matching your query:\n`;
            let cards = top.map(p => productCard(p)).join('');
            if (matches.length > 5) {
                text += `\n_Showing top 5 results. Visit our product pages for the full list!_`;
            }
            return { text, cards, quickReplies: ['More products', 'Best sellers'] };
        }

        // === CATEGORIES / SHOW PRODUCTS ===
        if (includesAny(q, ['categories', 'category', 'what do you sell', 'what products', 'all products', 'show products', 'view products', 'product list'])) {
            return {
                text: `We have a wide range of products! Here are our categories:\n\n🖱️ Mouse & Keyboards\n🎧 Earphones & Headsets\n🔊 Speakers & Microphones\n📷 Webcams\n🖥️ Monitors\n🔌 Chargers & Adapters\n🔋 Batteries & UPS\n🖨️ Toner & Cartridges\n💻 Computer Peripherals & CPU Fans\n\nWhat category interests you?`,
                quickReplies: ['Mouse', 'Earphones', 'Keyboards', 'Monitors', 'UPS'],
            };
        }

        // === BEST SELLERS (only when no product match found above) ===
        if (includesAny(q, ['best', 'popular', 'top', 'bestseller', 'recommend', 'suggestion', 'suggested', 'trending'])) {
            const popular = PRODUCTS.filter(p => p.tags.includes('popular')).slice(0, 4);
            let text = `🌟 Here are some of our **best-selling products:**\n`;
            let cards = popular.map(p => productCard(p)).join('');
            return { text, cards, quickReplies: ['Budget options', 'New arrivals', 'Show all brands'] };
        }

        // === NEW ARRIVALS ===
        if (includesAny(q, ['new', 'latest', 'arrival', 'just launched', 'launched'])) {
            const newItems = PRODUCTS.filter(p => p.tags.includes('new')).slice(0, 4);
            let text = `✨ Check out our **new arrivals:**\n`;
            let cards = newItems.map(p => productCard(p)).join('');
            return { text, cards, quickReplies: ['Best sellers', 'Budget options'] };
        }

        // === BUDGET / CHEAP ===
        if (includesAny(q, ['budget', 'cheap', 'affordable', 'low cost', 'lowest', 'inexpensive'])) {
            const budgetItems = PRODUCTS.filter(p => p.tags.includes('budget')).sort((a, b) => a.price - b.price).slice(0, 4);
            let text = `💰 Here are our most **affordable products:**\n`;
            let cards = budgetItems.map(p => productCard(p)).join('');
            return { text, cards, quickReplies: ['Best sellers', 'New arrivals'] };
        }

        // === GAMING ===
        if (includesAny(q, ['gaming', 'game', 'gamer'])) {
            const gaming = PRODUCTS.filter(p => p.tags.includes('gaming'));
            let text = `🎮 Here are our **gaming products:**\n`;
            let cards = gaming.map(p => productCard(p)).join('');
            return { text, cards, quickReplies: ['Best sellers', 'Budget options'] };
        }

        // === WIRELESS ===
        if (includesAny(q, ['wireless', 'bluetooth', 'cordless'])) {
            const wireless = PRODUCTS.filter(p => p.tags.includes('wireless') || p.tags.includes('bluetooth')).slice(0, 5);
            let text = `📡 Here are our **wireless products:**\n`;
            let cards = wireless.map(p => productCard(p)).join('');
            return { text, cards, quickReplies: ['Wired options', 'Best sellers'] };
        }

        // === PRICE QUERY ===
        if (includesAny(q, ['price', 'cost', 'how much', 'rate', 'mrp'])) {
            return {
                text: `Could you please specify the product name? For example, "What's the price of Logitech MX Master 3?"`,
                quickReplies: ['Show products', 'Best sellers'],
            };
        }

        // === GREETINGS (check after product search to avoid false positives) ===
        if (includesAny(q, ['hi', 'hello', 'hey', 'howdy', 'hola', 'good morning', 'good afternoon', 'good evening'])) {
            return {
                text: `Hello! 😊 Welcome to Global Solutions. How can I assist you today?`,
                quickReplies: ['Show products', 'Best sellers', 'Company info', 'Contact details'],
            };
        }

        // === THANKS / BYE ===
        if (includesAny(q, ['thank', 'thanks', 'bye', 'goodbye', 'see you', 'take care'])) {
            return {
                text: `You're welcome! 😊 Feel free to reach out anytime. Happy shopping! 🛍️`,
            };
        }

        // === CONVERSATIONAL / GENERAL QUESTIONS ===

        // How are you / How's it going
        if (includesAny(q, ['how are you', 'how r you', 'how r u', 'how do you do', 'how is it going', 'hows it going', 'how are things', 'whats up', 'what is up', 'sup'])) {
            return {
                text: `I'm doing great, thanks for asking! 😊 I'm here and ready to help you find the perfect product. What are you looking for today?`,
                quickReplies: ['Show products', 'Best sellers', 'Budget options'],
            };
        }

        // What is your name / Who are you
        if (includesAny(q, ['your name', 'who are you', 'what are you', 'whats your name', 'what is your name', 'who is this', 'introduce yourself'])) {
            return {
                text: `I'm **GS Assistant** 🤖 — the virtual shopping assistant for **Global Solutions**! I can help you browse products, compare prices, find deals, and answer your questions. Think of me as your personal tech shopping buddy!`,
                quickReplies: ['What can you do', 'Show products', 'Company info'],
            };
        }

        // Who made you / Who created you
        if (includesAny(q, ['who made you', 'who created you', 'who built you', 'who developed you', 'your creator', 'your developer'])) {
            return {
                text: `I was built by the **Global Solutions** team! 👨‍💻 My purpose is to make your shopping experience smoother and help you find exactly what you need.`,
                quickReplies: ['Company info', 'Show products'],
            };
        }

        // What do you sell / What products
        if (includesAny(q, ['what do you sell', 'what products', 'what do you have', 'what do you offer', 'what items', 'what you sell', 'what are your products'])) {
            return {
                text: `We sell a wide range of tech products! 🛍️\n\n🖱️ **Mice** – Logitech (wireless, gaming, ergonomic)\n🎧 **Earphones** – Fingers (wired, wireless, TWS, neckband)\n🔊 **Speakers** – Fingers (multimedia, Bluetooth)\n💻 **Laptop Accessories** – Lapcare (coolers, stands)\n🔌 **UPS** – Lapcare (power backup solutions)\n⌨️ **Peripherals** – Fingers (keyboards, combos)\n\nWant to explore a specific category?`,
                quickReplies: ['Earphones', 'Mice', 'Speakers', 'Best sellers'],
            };
        }

        // Tell me a joke
        if (includesAny(q, ['joke', 'funny', 'make me laugh', 'tell me something funny'])) {
            const jokes = [
                `Why did the computer go to the doctor? Because it had a virus! 🤒😄`,
                `What do you call a computer that sings? A-Dell! 🎵😂`,
                `Why was the JavaScript developer sad? Because he didn't Node how to Express himself! 😅`,
                `What's a computer's favourite snack? Microchips! 🍟😄`,
                `Why did the mouse feel cold? Because it was left next to the Windows! 🥶😂`,
            ];
            return {
                text: jokes[Math.floor(Math.random() * jokes.length)] + `\n\nAnyway, need help finding a product? 😊`,
                quickReplies: ['Show products', 'Best sellers', 'Tell me another joke'],
            };
        }

        // What time / date
        if (includesAny(q, ['what time', 'current time', 'what date', 'today date', 'what day'])) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            return {
                text: `🕐 The current time is **${timeStr}** and today is **${dateStr}**.\n\nIs there anything else I can help you with?`,
                quickReplies: ['Show products', 'Company info'],
            };
        }

        // Are you a bot / Are you real / Are you human
        if (includesAny(q, ['are you a bot', 'are you real', 'are you human', 'are you a robot', 'are you ai', 'are you artificial'])) {
            return {
                text: `I'm an AI-powered shopping assistant! 🤖 While I'm not human, I'm designed to help you find the best tech products at Global Solutions. I learn from our product catalog to give you the most accurate info!`,
                quickReplies: ['Show products', 'What can you do', 'Best sellers'],
            };
        }

        // How to order / How to buy
        if (includesAny(q, ['how to order', 'how to buy', 'how to purchase', 'how do i order', 'how do i buy', 'ordering process', 'buying process'])) {
            return {
                text: `Here's how to place an order: 🛒\n\n1️⃣ Browse our products and click **"Add to Cart"**\n2️⃣ Go to your **Cart** to review items\n3️⃣ Click **"Proceed to Checkout"**\n4️⃣ Fill in your shipping details\n5️⃣ Choose a payment method (Card, UPI, or COD)\n6️⃣ Confirm your order! ✅\n\nNeed help finding a product to get started?`,
                quickReplies: ['Show products', 'Payment methods', 'Shipping info'],
            };
        }

        // Discount / Offer / Deal / Coupon
        if (includesAny(q, ['discount', 'offer', 'deal', 'coupon', 'promo', 'sale', 'promotion', 'code'])) {
            return {
                text: `🎉 Great question! Here are our current offers:\n\n• **10% off** on orders above ₹5,000 (use code: **GS10**)\n• **Free shipping** on orders above ₹2,000\n• **₹200 off** on your first order\n\nCheck our **Best Sellers** for the most popular deals!`,
                quickReplies: ['Best sellers', 'Budget options', 'Show products'],
            };
        }

        // Warranty / Guarantee
        if (includesAny(q, ['warranty', 'guarantee', 'warranty period', 'product warranty'])) {
            return {
                text: `🛡️ All our products come with **manufacturer warranty**:\n\n• **Logitech** products: 1-3 year warranty\n• **Fingers** products: 1 year warranty\n• **Lapcare** products: 1 year warranty\n\nFor warranty claims, please contact our support team with your order details.`,
                quickReplies: ['Contact details', 'Show products'],
            };
        }

        // Good / Great / Nice / Awesome (positive feedback)
        if (includesAny(q, ['good', 'great', 'nice', 'awesome', 'amazing', 'cool', 'perfect', 'wonderful', 'excellent', 'love it', 'well done'])) {
            return {
                text: `Thank you so much! 😊🎉 I'm glad I could help! Is there anything else you'd like to know?`,
                quickReplies: ['Show products', 'Best sellers', 'Company info'],
            };
        }

        // === HELP ===
        if (includesAny(q, ['help', 'support', 'assist', 'what can you do', 'options'])) {
            return {
                text: `I can help you with:\n\n🛒 **Product Info** – Ask about any product\n🔍 **Search** – Find products by category, brand, or budget\n💰 **Pricing** – Get product prices\n📦 **Shipping** – Delivery information\n💳 **Payment** – Payment methods\n📞 **Contact** – Company contact details\n🕐 **General** – Time, jokes, order help & more\n\nJust type your question!`,
                quickReplies: ['Show products', 'Best sellers', 'Contact details'],
            };
        }

        // === FALLBACK ===
        return {
            text: `I'm sorry, I didn't quite understand that. 🤔\n\nTry asking me about:\n• A specific product (e.g., "Logitech mouse")\n• A category (e.g., "earphones")\n• Pricing (e.g., "products under 2000")\n• General questions (e.g., "how to order", "discounts")\n• Company info or contact details`,
            quickReplies: ['Show products', 'Best sellers', 'Help'],
        };
    }

    /* -------- UI BUILDER -------- */
    function buildChatbotUI() {
        // Toggle button
        const toggle = document.createElement('button');
        toggle.className = 'chatbot-toggle';
        toggle.id = 'chatbot-toggle';
        toggle.setAttribute('aria-label', 'Open chat');
        toggle.innerHTML = `
            <svg class="icon-chat" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>
            <svg class="icon-close" viewBox="0 0 24 24"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            <span class="chatbot-badge" id="chatbot-badge" style="display:none">1</span>
        `;

        // Chat window
        const win = document.createElement('div');
        win.className = 'chatbot-window';
        win.id = 'chatbot-window';
        win.innerHTML = `
            <div class="chatbot-header">
                <div class="chatbot-avatar">
                    <svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 010 2h-1.17A7.002 7.002 0 0113 22h-2a7.002 7.002 0 01-6.83-6H3a1 1 0 010-2h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zm0 7a5 5 0 00-5 5 5 5 0 005 5 5 5 0 005-5 5 5 0 00-5-5zm-1.5 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm3 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/></svg>
                </div>
                <div class="chatbot-header-info">
                    <h4>GS Assistant</h4>
                    <p><span class="chatbot-status-dot"></span> Online</p>
                </div>
            </div>
            <div class="chatbot-messages" id="chatbot-messages"></div>
            <div class="chatbot-input-area">
                <input type="text" id="chatbot-input" placeholder="Ask about products, pricing..." autocomplete="off" />
                <button class="chatbot-send-btn" id="chatbot-send" aria-label="Send message">
                    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
            <div class="chatbot-footer">Powered by <strong>Global Solutions</strong> AI</div>
        `;

        document.body.appendChild(toggle);
        document.body.appendChild(win);
    }

    /* -------- MESSAGE RENDERING -------- */
    const msgContainerId = 'chatbot-messages';

    function scrollToBottom() {
        const c = document.getElementById(msgContainerId);
        if (c) setTimeout(() => c.scrollTop = c.scrollHeight, 50);
    }

    function addBotMessage(text, cards, quickReplies) {
        const c = document.getElementById(msgContainerId);
        // Message bubble
        const wrap = document.createElement('div');
        wrap.className = 'chatbot-msg bot';
        wrap.innerHTML = `
            <div class="chatbot-msg-avatar"><svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 010 2h-1.17A7.002 7.002 0 0113 22h-2a7.002 7.002 0 01-6.83-6H3a1 1 0 010-2h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zm0 7a5 5 0 00-5 5 5 5 0 005 5 5 5 0 005-5 5 5 0 00-5-5zm-1.5 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm3 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/></svg></div>
            <div class="chatbot-bubble">${renderText(text)}${cards || ''}</div>
        `;
        c.appendChild(wrap);

        // Quick replies
        if (quickReplies && quickReplies.length) {
            const qr = document.createElement('div');
            qr.className = 'chatbot-quick-replies';
            quickReplies.forEach(label => {
                const btn = document.createElement('button');
                btn.className = 'chatbot-quick-btn';
                btn.textContent = label;
                btn.addEventListener('click', () => {
                    // Remove all quick replies
                    c.querySelectorAll('.chatbot-quick-replies').forEach(el => el.remove());
                    handleUserInput(label);
                });
                qr.appendChild(btn);
            });
            c.appendChild(qr);
        }
        scrollToBottom();
    }

    function addUserMessage(text) {
        const c = document.getElementById(msgContainerId);
        const wrap = document.createElement('div');
        wrap.className = 'chatbot-msg user';
        wrap.innerHTML = `
            <div class="chatbot-msg-avatar"><svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>
            <div class="chatbot-bubble">${escHtml(text)}</div>
        `;
        c.appendChild(wrap);
        scrollToBottom();
    }

    function showTyping() {
        const c = document.getElementById(msgContainerId);
        const t = document.createElement('div');
        t.className = 'chatbot-typing';
        t.id = 'chatbot-typing';
        t.innerHTML = `
            <div class="chatbot-msg-avatar" style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#003473,#22abeb);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:#fff;"><path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 010 2h-1.17A7.002 7.002 0 0113 22h-2a7.002 7.002 0 01-6.83-6H3a1 1 0 010-2h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2z"/></svg></div>
            <div class="chatbot-typing-dots"><span></span><span></span><span></span></div>
        `;
        c.appendChild(t);
        scrollToBottom();
    }

    function hideTyping() {
        const t = document.getElementById('chatbot-typing');
        if (t) t.remove();
    }

    /* -------- INPUT HANDLER -------- */
    function handleUserInput(text) {
        if (!text.trim()) return;
        addUserMessage(text);

        // Remove old quick replies
        const c = document.getElementById(msgContainerId);
        c.querySelectorAll('.chatbot-quick-replies').forEach(el => el.remove());

        showTyping();

        // Simulate "thinking" delay
        const delay = 600 + Math.random() * 800;
        setTimeout(() => {
            hideTyping();
            const resp = getResponse(text);
            addBotMessage(resp.text, resp.cards || '', resp.quickReplies || []);
        }, delay);
    }

    /* -------- INIT -------- */
    function init() {
        buildChatbotUI();

        const toggle = document.getElementById('chatbot-toggle');
        const win = document.getElementById('chatbot-window');
        const input = document.getElementById('chatbot-input');
        const send = document.getElementById('chatbot-send');
        const badge = document.getElementById('chatbot-badge');

        let opened = false;

        // Show badge after 3 seconds
        setTimeout(() => {
            if (!opened) {
                badge.style.display = 'flex';
            }
        }, 3000);

        toggle.addEventListener('click', () => {
            const isOpen = win.classList.toggle('open');
            toggle.classList.toggle('active', isOpen);

            if (isOpen && !opened) {
                opened = true;
                badge.style.display = 'none';
                // Show greeting
                setTimeout(() => {
                    addBotMessage(GREETINGS[0], '', ['Show products', 'Best sellers', 'Company info', 'Contact details']);
                }, 400);
            }
            if (isOpen) {
                setTimeout(() => input.focus(), 400);
            }
        });

        send.addEventListener('click', () => {
            handleUserInput(input.value);
            input.value = '';
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleUserInput(input.value);
                input.value = '';
            }
        });
    }

    // Auto-init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
