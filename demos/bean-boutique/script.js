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

function getCartItems() {
    try {
        const cart = JSON.parse(localStorage.getItem('beanBoutiqueCart') || '[]');
        if (!Array.isArray(cart)) return [];

        return cart.filter(item => item &&
            typeof item.name === 'string' &&
            Number.isFinite(item.price) && item.price >= 0 &&
            Number.isSafeInteger(item.quantity) && item.quantity > 0);
    } catch {
        return [];
    }
}

function createTextCell(className, label, value) {
    const cell = document.createElement('td');
    cell.className = className;
    cell.dataset.label = label;
    cell.textContent = value;
    return cell;
}

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
    const cart = getCartItems();
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
    const cart = getCartItems();
    if (!cart[index]) return;
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    localStorage.setItem('beanBoutiqueCart', JSON.stringify(cart));
    window.updateCartBadge();
    if(typeof window.renderCartPage === 'function') window.renderCartPage();
    if(typeof window.renderCheckoutPage === 'function') window.renderCheckoutPage();
};

window.removeItem = function(index) {
    const cart = getCartItems();
    if (!cart[index]) return;
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
        const cart = getCartItems();
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

            if(name && Number.isFinite(price) && price >= 0) {
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
        
        const cart = getCartItems();
        cartTableBody.replaceChildren();
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
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            const row = document.createElement('tr');
            row.append(
                createTextCell('cart-cell cart-product-cell', 'Product Name', item.name),
                createTextCell('cart-cell', 'Price', `$${item.price.toFixed(2)}`)
            );

            const quantityCell = document.createElement('td');
            quantityCell.className = 'cart-cell';
            quantityCell.dataset.label = 'Quantity';
            const decreaseButton = document.createElement('button');
            decreaseButton.type = 'button';
            decreaseButton.className = 'cart-qty-btn';
            decreaseButton.setAttribute('aria-label', 'Decrease quantity');
            decreaseButton.textContent = '-';
            decreaseButton.addEventListener('click', () => window.changeQuantity(index, -1));
            const quantity = document.createElement('span');
            quantity.className = 'cart-qty-value';
            quantity.textContent = String(item.quantity);
            const increaseButton = document.createElement('button');
            increaseButton.type = 'button';
            increaseButton.className = 'cart-qty-btn';
            increaseButton.setAttribute('aria-label', 'Increase quantity');
            increaseButton.textContent = '+';
            increaseButton.addEventListener('click', () => window.changeQuantity(index, 1));
            quantityCell.append(decreaseButton, quantity, increaseButton);
            row.append(quantityCell, createTextCell('cart-cell', 'Subtotal', `$${itemTotal.toFixed(2)}`));

            const actionCell = document.createElement('td');
            actionCell.className = 'cart-cell';
            actionCell.dataset.label = 'Action';
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'cart-remove-btn';
            removeButton.setAttribute('aria-label', `Remove ${item.name}`);
            removeButton.addEventListener('click', () => window.removeItem(index));
            const removeIcon = document.createElement('i');
            removeIcon.className = 'fa-solid fa-trash-can';
            removeIcon.setAttribute('aria-hidden', 'true');
            removeButton.appendChild(removeIcon);
            actionCell.appendChild(removeButton);
            row.appendChild(actionCell);
            cartTableBody.appendChild(row);
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
        
        const cart = getCartItems();
        checkoutSummaryBody.replaceChildren();
        let grandTotal = 0;

        if (checkoutForm && !checkoutForm.dataset.listenerAttached) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (getCartItems().length === 0) { alert('Your cart is empty!'); return; }

                const successOverlay = document.getElementById('successOverlay');
                if (successOverlay) successOverlay.style.display = 'flex';
                else alert('Order Successful! Thank you.');

                localStorage.removeItem('beanBoutiqueCart');
                setTimeout(() => { window.location.href = 'Home.html'; }, 3000);
            });
            checkoutForm.dataset.listenerAttached = 'true';
        }
        
        if (cart.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 3;
            cell.className = 'checkout-empty-message';
            cell.textContent = 'Your cart is empty.';
            row.appendChild(cell);
            checkoutSummaryBody.appendChild(row);
            if(checkoutGrandTotal) checkoutGrandTotal.innerText = '$0.00';
            return;
        }
        
        cart.forEach(item => {
            const subTotal = item.price * item.quantity;
            grandTotal += subTotal;
            const row = document.createElement('tr');
            row.append(
                createTextCell('checkout-summary-item', '', item.name),
                createTextCell('checkout-summary-qty', '', `x ${item.quantity}`),
                createTextCell('checkout-summary-price', '', `$${subTotal.toFixed(2)}`)
            );
            checkoutSummaryBody.appendChild(row);
        });
        if (checkoutGrandTotal) checkoutGrandTotal.innerText = `$${grandTotal.toFixed(2)}`;
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

    const cart = getCartItems();
    const cartContainer = document.getElementById('cart-items-container');
    const emptyMessage = document.getElementById('empty-cart-message');

    if (!cartContainer) return;

    cartContainer.replaceChildren();
    if (cart.length === 0) {
        if (emptyMessage) emptyMessage.style.display = 'block';
        return;
    }

    if (emptyMessage) emptyMessage.style.display = 'none';

    const total = document.createElement('div');
    total.className = 'cart-items-total';
    let totalAmount = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item';

        const name = document.createElement('span');
        name.className = 'item-name';
        name.textContent = item.name;
        const price = document.createElement('span');
        price.className = 'item-price';
        price.textContent = `$${item.price.toFixed(2)}`;
        const quantity = document.createElement('span');
        quantity.className = 'item-qty';
        quantity.textContent = `Qty: ${item.quantity}`;
        const subtotal = document.createElement('span');
        subtotal.className = 'item-subtotal';
        subtotal.textContent = `$${itemTotal.toFixed(2)}`;

        const decrease = document.createElement('button');
        decrease.type = 'button';
        decrease.textContent = '-';
        decrease.setAttribute('aria-label', 'Decrease quantity');
        decrease.addEventListener('click', () => updateQuantity(index, -1));
        const increase = document.createElement('button');
        increase.type = 'button';
        increase.textContent = '+';
        increase.setAttribute('aria-label', 'Increase quantity');
        increase.addEventListener('click', () => updateQuantity(index, 1));
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.textContent = 'Remove';
        remove.setAttribute('aria-label', `Remove ${item.name}`);
        remove.addEventListener('click', () => removeFromCart(index));

        itemRow.append(name, price, quantity, subtotal, decrease, increase, remove);
        cartContainer.appendChild(itemRow);
    });

    total.textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
    cartContainer.appendChild(total);
}

// Function
function updateQuantity(index, change) {
    const cart = getCartItems();
    if (!cart[index]) return;
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
    const cart = getCartItems();
    if (!cart[index]) return;
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
