// Smooth scroll for internal anchors (kept later once)
// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Close menu when a link is clicked
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
    });
});

// Dropdown Menu Mobile
const dropdownItems = document.querySelectorAll('.dropdown');
dropdownItems.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });
});

// CART: persistent cart using localStorage
const CART_KEY = 'nb_cart_v1';

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function addToCart(item) {
    const cart = getCart();
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        existing.qty += item.qty || 1;
    } else {
        cart.push({ ...item, qty: item.qty || 1 });
    }
    saveCart(cart);
}

function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((s, i) => s + (i.qty || 0), 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = count;
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => updateCartCount());

// Add to Cart buttons (works on list cards and single product pages)
document.querySelectorAll('.btn-add-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();

        // Try to locate a product card (list / grid) first
        let card = button.closest('.product-card, .seller-card');
        let id, name, price;

        if (card) {
            id = card.getAttribute('data-id') || (card.querySelector('h3') ? card.querySelector('h3').textContent.trim().toLowerCase().replace(/\s+/g, '-') : null);
            name = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : 'Product';
            const priceText = card.querySelector('.price') ? card.querySelector('.price').textContent.replace(/[^0-9\.]/g, '') : '0';
            price = parseFloat(priceText) || 0;
        } else {
            // Fallback: single product page structure
            const productPage = button.closest('.product-page') || document.querySelector('.product-page');
            if (productPage) {
                // prefer a data-id on the .product-page if present
                id = productPage.getAttribute('data-id') || null;
                const titleEl = productPage.querySelector('h1, h2, h3');
                name = titleEl ? titleEl.textContent.trim() : (document.title || 'Product');
                const priceEl = productPage.querySelector('.price') || document.querySelector('.price');
                const priceText = priceEl ? priceEl.textContent.replace(/[^0-9\.]/g, '') : '0';
                price = parseFloat(priceText) || 0;

                if (!id) {
                    // derive id from filename or name
                    const fileName = window.location.pathname.split('/').pop();
                    id = fileName ? fileName.replace('.html', '') : name.toLowerCase().replace(/\s+/g, '-');
                }
            } else {
                // Last-resort fallback
                name = document.querySelector('h1, h2, h3') ? document.querySelector('h1, h2, h3').textContent.trim() : 'product';
                id = name.toLowerCase().replace(/\s+/g, '-');
                const priceEl = document.querySelector('.price');
                const priceText = priceEl ? priceEl.textContent.replace(/[^0-9\.]/g, '') : '0';
                price = parseFloat(priceText) || 0;
            }
        }

        const item = { id, name, price, qty: 1 };
        addToCart(item);

        // feedback
        const originalText = button.textContent;
        button.textContent = 'Added ✓';
        button.disabled = true;
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 1400);
    });
});

// Contact Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const phone = contactForm.querySelector('input[type="tel"]').value;
        const message = contactForm.querySelector('textarea').value;
        if (!name || !email || !message) {
            alert('Please fill in all required fields');
            return;
        }
        const subject = `New Contact Request from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`;
        const mailtoLink = `mailto:info@nomnothobeauty.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
        contactForm.reset();
    });
}

// CART PAGE: render cart if on cart.html
function renderCartPage() {
    if (!document.getElementById('cartPage')) return;
    const cart = getCart();
    const list = document.getElementById('cartList');
    const subtotalEl = document.getElementById('cartSubtotal');
    list.innerHTML = '';
    if (cart.length === 0) {
        list.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
        if (subtotalEl) subtotalEl.textContent = 'R0.00';
        const totalEl = document.getElementById('cartTotal');
        if (totalEl) totalEl.textContent = 'R0.00';
        return;
    }
    let subtotal = 0;
    cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-row';
        row.innerHTML = `
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-qty">Qty: <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="cart-qty-input" /></div>
            <div class="cart-item-price">R${(item.price).toFixed(2)}</div>
            <div class="cart-item-remove"><button class="btn-remove" data-id="${item.id}">Remove</button></div>
        `;
        list.appendChild(row);
        subtotal += (item.price * (item.qty || 1));
    });
    if (subtotalEl) subtotalEl.textContent = `R${subtotal.toFixed(2)}`;
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = `R${subtotal.toFixed(2)}`;

    // wire up qty inputs and remove buttons
    document.querySelectorAll('.cart-qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = input.dataset.id;
            const val = parseInt(input.value) || 1;
            const cart = getCart();
            const item = cart.find(i => i.id === id);
            if (item) {
                item.qty = val;
                saveCart(cart);
                renderCartPage();
            }
        });
    });

    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.dataset.id;
            removeFromCart(id);
            renderCartPage();
        });
    });
}

// CHECKOUT PAGE: simple checkout renderer
function renderCheckoutPage() {
    if (!document.getElementById('checkoutPage')) return;
    const cart = getCart();
    const orderList = document.getElementById('checkoutList');
    const totalEl = document.getElementById('checkoutTotal');
    orderList.innerHTML = '';
    if (cart.length === 0) {
        orderList.innerHTML = '<p>Your cart is empty.</p>';
        if (totalEl) totalEl.textContent = 'R0.00';
        return;
    }
    let total = 0;
    cart.forEach(item => {
        const li = document.createElement('div');
        li.className = 'checkout-item';
        li.innerHTML = `<div>${item.name} x ${item.qty}</div><div>R${(item.price*item.qty).toFixed(2)}</div>`;
        orderList.appendChild(li);
        total += item.price * item.qty;
    });
    if (totalEl) totalEl.textContent = `R${total.toFixed(2)}`;

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const checkoutMessage = document.getElementById('checkoutMessage');
            const payBtn = document.getElementById('payNowBtn');
            const spinner = document.getElementById('paySpinner');

            // Basic validation for billing and card inputs (demo only)
            const name = document.getElementById('billName').value.trim();
            const email = document.getElementById('billEmail').value.trim();
            const phone = document.getElementById('billPhone').value.trim();
            const address = document.getElementById('billAddress').value.trim();
            const cardNum = document.getElementById('cardNumber').value.replace(/\s+/g, '');
            const cardExp = document.getElementById('cardExp').value.trim();
            const cardCvc = document.getElementById('cardCvc').value.trim();

            if (!name || !email || !phone || !address) { checkoutMessage.textContent = 'Please complete billing details.'; return; }
            if (!/^[0-9]{12,19}$/.test(cardNum)) { checkoutMessage.textContent = 'Enter a valid card number (demo).' ; return; }
            if (!/^[0-9]{3,4}$/.test(cardCvc)) { checkoutMessage.textContent = 'Enter a valid CVC (demo).'; return; }

            // Simulate payment processing
            checkoutMessage.textContent = '';
            payBtn.disabled = true; spinner.style.display = 'inline-block';

            setTimeout(() => {
                // Simulated payment success
                const orderId = 'NB' + Date.now();
                const order = { id: orderId, name, email, total: total.toFixed(2), items: cart };
                try { localStorage.setItem('nb_last_order', JSON.stringify(order)); } catch (err) {}
                clearCart();
                // Redirect to confirmation page
                window.location.href = 'order-confirmation.html';
            }, 1400);
        });
    }
}

// Smooth scroll for anchor links (retain)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);
document.querySelectorAll('.product-card, .seller-card, .review-card, .category-card, .blog-card').forEach(el => observer.observe(el));

// Add keyframe animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: translateY(0);} }
    @keyframes fadeIn { from { opacity: 0;} to { opacity: 1;} }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px);} to { opacity: 1; transform: translateX(0);} }
    @keyframes slideIn { from { opacity: 0; transform: translateX(10px);} to { opacity: 1; transform: translateX(0);} }
`;
document.head.appendChild(style);

// Handle responsive behavior
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        if (navMenu) navMenu.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
    }
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = 'var(--shadow)';
    }
});

// Render cart/checkout pages if present
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCartPage();
    renderCheckoutPage();
});
