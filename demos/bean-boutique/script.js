/* ==========================================================
   1. GLOBAL FUNCTIONS 
   ========================================================== */
let currentItemPrice = 6.50;

window.selectSize = function(element, price) {
    document.querySelectorAll('.size-option').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    currentItemPrice = price;
    const priceDisplay = document.getElementById('currentPrice');
    if (priceDisplay) priceDisplay.innerText = currentItemPrice.toFixed(2);
};

window.openRegistration = function(eventName) {
    const regModal = document.getElementById('registrationModal');
    const eventNameDisplay = document.getElementById('eventNameDisplay');
    const eventNameField = document.getElementById('regEventName');
    if (eventNameDisplay && regModal) {
        eventNameDisplay.innerText = eventName;
        if (eventNameField) {
            eventNameField.value = eventName;
        }
        regModal.style.display = 'flex';
    }
};

window.closeRegistration = function() {
    const regModal = document.getElementById('registrationModal');
    if (regModal) regModal.style.display = 'none';
};



const DISCOUNT_MODAL_STORAGE_KEY = 'beanBoutiqueDiscountSeenV2';
const DISCOUNT_EMAIL_STORAGE_KEY = 'beanBoutiqueDiscountEmail';

window.openAuthModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
};

window.closeAuthModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
};

window.switchAuth = function(currentModalId, nextModalId) {
    window.closeAuthModal(currentModalId);
    window.openAuthModal(nextModalId);
};

window.openDiscountModal = function() {
    const modal = document.getElementById('discountModal');
    if (modal) {
        modal.style.display = 'flex';
    }
};

window.closeDiscountModal = function(markAsSeen = true) {
    const modal = document.getElementById('discountModal');
    if (modal) {
        modal.style.display = 'none';
    }

    if (markAsSeen) {
        localStorage.setItem(DISCOUNT_MODAL_STORAGE_KEY, 'true');
    }
};

/* ==========================================================
   2. GLOBAL CART FUNCTIONS
   ========================================================== */

window.updateCartBadge = function() {
    let cart = JSON.parse(localStorage.getItem('beanBoutiqueCart')) || [];
    let totalItems = 0;
    cart.forEach(item => { totalItems += item.quantity; });
    
    const countSpan = document.getElementById('cart-count');
    if (countSpan) {
        if (totalItems > 0) {
            countSpan.innerText = totalItems;
            countSpan.hidden = false;
        } else {
            countSpan.innerText = '';
            countSpan.hidden = true;
        }
    }
};

window.changeQuantity = function(index, change) {
    let cart = JSON.parse(localStorage.getItem('beanBoutiqueCart')) || [];
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    localStorage.setItem('beanBoutiqueCart', JSON.stringify(cart));
    window.updateCartBadge();
    if(typeof window.renderCartPage === 'function') window.renderCartPage();
    if(typeof window.renderCheckoutPage === 'function') window.renderCheckoutPage();
};

window.removeItem = function(index) {
    let cart = JSON.parse(localStorage.getItem('beanBoutiqueCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('beanBoutiqueCart', JSON.stringify(cart));
    window.updateCartBadge();
    if(typeof window.renderCartPage === 'function') window.renderCartPage();
    if(typeof window.renderCheckoutPage === 'function') window.renderCheckoutPage();
};

/* ==========================================================
   3. MAIN DOM LOADED 
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
    if (window.AOS) {
        window.AOS.init({
            duration: 700,
            offset: 70,
            once: true
        });
    }

    const discountModal = document.getElementById('discountModal');
    const closeDiscountBtn = document.getElementById('closeModal');
    const discountForm = document.getElementById('discountForm');
    const authModalIds = ['signInModal', 'signUpModal'];

    if (discountModal) {
        if (!localStorage.getItem(DISCOUNT_MODAL_STORAGE_KEY)) {
            setTimeout(() => {
                window.openDiscountModal();
            }, 700);
        }

        if (closeDiscountBtn) {
            closeDiscountBtn.addEventListener('click', () => {
                window.closeDiscountModal();
            });
        }

        discountModal.addEventListener('click', (event) => {
            if (event.target === discountModal) {
                window.closeDiscountModal();
            }
        });

        if (discountForm && !discountForm.dataset.listenerAttached) {
            discountForm.addEventListener('submit', (event) => {
                event.preventDefault();

                const emailInput = document.getElementById('userEmail');
                const emailValue = emailInput ? emailInput.value.trim() : '';

                if (emailValue) {
                    localStorage.setItem(DISCOUNT_EMAIL_STORAGE_KEY, emailValue);
                }

                localStorage.setItem(DISCOUNT_MODAL_STORAGE_KEY, 'claimed');
                window.closeDiscountModal(false);
                discountForm.reset();
                window.showToast('15% discount claimed successfully!');
            });

            discountForm.dataset.listenerAttached = 'true';
        }
    }

    authModalIds.forEach((modalId) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                window.closeAuthModal(modalId);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;

        window.closeRegistration();
        if (discountModal && discountModal.style.display === 'flex') {
            window.closeDiscountModal();
        }
        authModalIds.forEach((modalId) => window.closeAuthModal(modalId));
    });

    // 
    window.updateCartBadge();

    // MOBILE MENU TOGGLE
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    if(mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    //  MOBILE MENU TOGGLE (Hamburger & Mobile Nav)
    const navToggle = document.getElementById('navToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            mobileNav.classList.toggle('open');
        });
    }

    //  ANIMATED TEXT SEARCH 
    const searchBox = document.getElementById('coffeeSearchBox');
    if (searchBox) {
        searchBox.addEventListener('keyup', function() {
            let filter = this.value.toLowerCase();
            let cards = document.querySelectorAll('.coffee-card');
            
            cards.forEach(card => {
                let titleElement = card.querySelector('h3');
                if (titleElement) {
                    let title = titleElement.innerText.toLowerCase();
                    const matches = title.indexOf(filter) > -1;
                    card.classList.toggle('is-hidden', !matches);
                }
            });
        });
    }

    //  HOME PAGE: SLIDESHOW
    const slides = document.getElementsByClassName("slide");
    let slideIndex = 0;
    if (slides.length > 0) {
        function showSlides() {
            for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";  
            slideIndex++;
            if (slideIndex > slides.length) slideIndex = 1;    
            slides[slideIndex - 1].style.display = "block";  
            setTimeout(showSlides, 4000); 
        }
        showSlides();
    }

    // ADD TO CART SYSTEM (Event Delegation for Coffee and Equipment Pages)
    function addItemToCart(name, price) {
        let cart = JSON.parse(localStorage.getItem('beanBoutiqueCart')) || [];
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: name, price: price, quantity: 1 });
        }
        localStorage.setItem('beanBoutiqueCart', JSON.stringify(cart));
        
        window.updateCartBadge(); 
        window.showToast(`${name} added to cart successfully!`);
    }

    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-instant-cart') || e.target.classList.contains('btn-add-cart')) {
            // Customize 
            if(e.target.hasAttribute('onclick') && e.target.getAttribute('onclick').includes('window.location')) return;

            e.preventDefault();
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));

            if(name && price) {
                addItemToCart(name, price);
            }
        }
    });

    // Detail View Add to Order 
    const addToOrderBtn = document.getElementById('addToOrderBtn'); 
    if (addToOrderBtn) {
        addToOrderBtn.addEventListener('click', () => {
            const titleElement = document.querySelector('.product-title-info h1');
            const productTitle = titleElement ? titleElement.innerText.replace('\n', ' ') : 'Custom Coffee';
            const activeSizeElement = document.querySelector('.size-option.active .size-name');
            const activeSize = activeSizeElement ? activeSizeElement.innerText : 'Grande';
            
            addItemToCart(`${productTitle} (${activeSize})`, currentItemPrice); 
        });
    }

    //  CART PAGE UI 
    window.renderCartPage = function() {
        const cartTableBody = document.getElementById('cartTableBody');
        const cartGrandTotal = document.getElementById('cartGrandTotal');
        const cartContent = document.getElementById('cartContent');
        if (!cartTableBody) return; 
        
        let cart = JSON.parse(localStorage.getItem('beanBoutiqueCart')) || [];
        cartTableBody.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart-state">
                    <h2>Your cart is currently empty</h2>
                    <a href="Coffee.html" class="empty-cart-link">Explore Coffee</a>
                </div>`;
            return;
        }
        
        cart.forEach((item, index) => {
            let itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartTableBody.innerHTML += `
                <tr>
                    <td class="cart-cell cart-product-cell" data-label="Product Name">${item.name}</td>
                    <td class="cart-cell" data-label="Price">$${item.price.toFixed(2)}</td>
                    <td class="cart-cell" data-label="Quantity">
                        <button onclick="changeQuantity(${index}, -1)" class="cart-qty-btn" aria-label="Decrease quantity">-</button>
                        <span class="cart-qty-value">${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)" class="cart-qty-btn" aria-label="Increase quantity">+</button>
                    </td>
                    <td class="cart-cell" data-label="Subtotal">$${itemTotal.toFixed(2)}</td>
                    <td class="cart-cell" data-label="Action"><button onclick="removeItem(${index})" class="cart-remove-btn" aria-label="Remove ${item.name}"><i class="fa-solid fa-trash-can"></i></button></td>
                </tr>`;
        });
        if(cartGrandTotal) cartGrandTotal.innerText = `$${total.toFixed(2)}`;
    };
    if(document.getElementById('cartTableBody')) window.renderCartPage();

    // CHECKOUT PAGE UI 
    window.renderCheckoutPage = function() {
        const checkoutSummaryBody = document.getElementById('checkoutSummaryBody');
        const checkoutGrandTotal = document.getElementById('checkoutGrandTotal');
        const checkoutForm = document.getElementById('checkoutForm');
        if (!checkoutSummaryBody) return; 
        
        let cart = JSON.parse(localStorage.getItem('beanBoutiqueCart')) || [];
        checkoutSummaryBody.innerHTML = '';
        let grandTotal = 0;
        
        if (cart.length === 0) {
            checkoutSummaryBody.innerHTML = "<tr><td colspan='3' class='checkout-empty-message'>Your cart is empty.</td></tr>";
            if(checkoutGrandTotal) checkoutGrandTotal.innerText = '$0.00';
            return;
        }
        
        cart.forEach(item => {
            let subTotal = item.price * item.quantity;
            grandTotal += subTotal;
            checkoutSummaryBody.innerHTML += `
                <tr>
                    <td class="checkout-summary-item">${item.name}</td>
                    <td class="checkout-summary-qty">x ${item.quantity}</td>
                    <td class="checkout-summary-price">$${subTotal.toFixed(2)}</td>
                </tr>`;
        });
        if (checkoutGrandTotal) checkoutGrandTotal.innerText = `$${grandTotal.toFixed(2)}`;

        if (checkoutForm && !checkoutForm.dataset.listenerAttached) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault(); 
                if (cart.length === 0) { alert("Your cart is empty!"); return; }
                
                const successOverlay = document.getElementById('successOverlay');
                if(successOverlay) successOverlay.style.display = 'flex'; 
                else alert("Order Successful! Thank you.");
                
                localStorage.removeItem('beanBoutiqueCart'); 
                setTimeout(() => { window.location.href = "Home.html"; }, 3000);
            });
            checkoutForm.dataset.listenerAttached = 'true';
        }
    };
    if(document.getElementById('checkoutSummaryBody')) window.renderCheckoutPage();

});

function claimOffer() {
        alert("🎉 Offer Claimed Successfully!\nYour 'Buy 1 Get 1 Free' coupon has been added to your account.");
    }

    // Subscribe 
    function subscribeAlert(tierName) {
        alert("✅ Thank you for choosing the " + tierName + " Tier!\nWe will redirect you to the payment page to complete your subscription.");
        // Payment Page 
        // window.location.href = 'Payment.html';
    }

    // Promo  Cart 
    function addPromoCart(itemName) {
        alert("🛒 " + itemName + " (Buy 1 Get 1 Free) has been added to your cart!");
        
        // Cart (Navigation BarCart Icon)
        let cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.hidden = false;
            let current = parseInt(cartCount.innerText) || 0;
            cartCount.innerText = current + 1;
        }
    }

 /* ==========================================================
   DISPLAY CART ITEMS (No Images, Table Format - FIXED)
   ========================================================== */
function displayCartItems() {
    
    let cart = JSON.parse(localStorage.getItem('beanBoutiqueCart')) || [];
    let cartContainer = document.getElementById('cart-items-container');
    let emptyMessage = document.getElementById('empty-cart-message');

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '';
        if (emptyMessage) emptyMessage.style.display = 'block';
        return;
    }

    if (emptyMessage) emptyMessage.style.display = 'none';

    let cartHTML = `
        <div style="display: grid; grid-template-columns: 3fr 1fr 1fr 1fr 0.5fr; gap: 15px; border-bottom: 2px solid #eaeaea; padding-bottom: 10px; margin-bottom: 20px; font-family: 'Lora', serif; color: #888; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px;">
            <div>Product Name</div>
            <div style="text-align: center;">Price</div>
            <div style="text-align: center;">Quantity</div>
            <div style="text-align: right;">Subtotal</div>
            <div style="text-align: right;">Action</div>
        </div>
    `;

    let totalAmount = 0;

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        
        cartHTML += `
            <div class="cart-item" style="display: grid; grid-template-columns: 3fr 1fr 1fr 1fr 0.5fr; gap: 15px; align-items: center; border-bottom: 1px solid #f5f5f5; padding: 20px 0; font-family: 'Poppins', sans-serif;">
                <div style="font-weight: 600; color: #333;">${item.name}</div>
                <div style="text-align: center; color: #666;">$${item.price.toFixed(2)}</div>
                
                <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
                    <button onclick="updateQuantity(${index}, -1)" style="background: #f0f0f0; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-weight: bold; color: #555;">-</button>
                    <span style="font-weight: 600;">${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)" style="background: #f0f0f0; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-weight: bold; color: #555;">+</button>
                </div>
                
                <div style="text-align: right; color: #333;">$${itemTotal.toFixed(2)}</div>
                <div style="text-align: right;">
                    <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 1.2rem;" title="Remove Item">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    cartHTML += `
        <div style="text-align: right; margin-top: 40px; font-size: 1.6rem; font-family: 'Playfair Display', serif; color: #f4b04f;">
            <strong>Total Amount: $${totalAmount.toFixed(2)}</strong>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px;">
            <button class="btn-secondary" style="padding: 12px 30px; font-size: 1rem; border-radius: 8px; border: 1px solid #ccc; background: #f9f9f9; cursor: pointer;" onclick="window.location.href='Coffee.html'">Continue Shopping</button>
            <button class="btn-primary" style="padding: 12px 30px; font-size: 1rem; border-radius: 8px; background: #f4b04f; color: white; border: none; cursor: pointer;" onclick="alert('Proceeding to Checkout...')">Proceed to Checkout</button>
        </div>
    `;

    cartContainer.innerHTML = cartHTML;
}

// Function
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('beanBoutiqueCart')) || [];
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('beanBoutiqueCart', JSON.stringify(cart));
    if (window.updateCartBadge) window.updateCartBadge(); 
    displayCartItems();
}

// Function
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('beanBoutiqueCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('beanBoutiqueCart', JSON.stringify(cart));
    if (window.updateCartBadge) window.updateCartBadge(); 
    displayCartItems();
}


window.addEventListener('load', displayCartItems);

/* ==========================================================
   GOOGLE reCAPTCHA MOCKUP FUNCTIONALITY
   ========================================================== */
let isRecaptchaChecked = false;

// 1. reCAPTCHA Box 
window.toggleRecaptcha = function() {
    const checkIcon = document.getElementById('rc-check-icon');
    const errorMsg = document.getElementById('recaptcha-error');
    
    if (checkIcon) {
        checkIcon.style.display = 'block'; 
        isRecaptchaChecked = true;         
        if(errorMsg) errorMsg.style.display = 'none'; 
    }
};

// 2. Event Registration Form  Submit 
// Form  ID  'registrationForm'
document.addEventListener('DOMContentLoaded', () => {
    const regForm = document.getElementById('registrationForm'); 
    
    if (regForm) {
        regForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const errorMsg = document.getElementById('recaptcha-error');
            
            
            if (!isRecaptchaChecked) {
                if(errorMsg) errorMsg.style.display = 'block'; 
                return; 
            }
            
            
            alert("✅ Registration Successful! See you at the event.");
            
            
            if(window.closeRegistration) window.closeRegistration();
            regForm.reset();
            isRecaptchaChecked = false; // reCAPTCHA 
            const checkIcon = document.getElementById('rc-check-icon');
            if(checkIcon) checkIcon.style.display = 'none';
        });
    }
});

/* ==========================================================
   SWEETALERT2 TOAST NOTIFICATION (FIXED POSITION)
   ========================================================== */
window.showToast = function(message) {
    if (typeof Swal !== 'undefined') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end', 
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            
            customClass: {
                container: 'bean-swal-container', 
                popup: 'bean-premium-toast',
                title: 'bean-toast-title'
            },
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: 'success',
            title: message
        });
    } else {
        alert("🛒 " + message);
    }
};

/* ==========================================================
   DELIVERY PAGE TOGGLE FUNCTION
   ========================================================== */
window.toggleDeliveryMode = function(mode) {
    const btnPickup = document.getElementById('btnPickup');
    const btnDelivery = document.getElementById('btnDelivery');
    
    
    if (!btnPickup || !btnDelivery) return;

    if (mode === 'pickup') {
        btnPickup.classList.add('active');
        btnDelivery.classList.remove('active');
        document.querySelector('.delivery-text-area h1').innerText = "Order and pick up";
        
    } else {
        btnDelivery.classList.add('active');
        btnPickup.classList.remove('active');
        document.querySelector('.delivery-text-area h1').innerText = "Today deserves delivery";
        
    }
};

/* ==========================================================
   LEGAL PAGE TABS FUNCTION
   ========================================================== */
window.openLegalTab = function(evt, tabName) {
    
    const tabContents = document.getElementsByClassName("legal-tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }

    
    const tabLinks = document.getElementsByClassName("legal-tab-btn");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }

    
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
};
