// File: assets/cart.js

let cartItems = [];

// DOM উপাদান নির্বাচন
const cartTableBody = document.getElementById('cartTableBody');
const cartSubtotalElement = document.getElementById('cartSubtotal');
const cartTotalElement = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');
const emptyCartMessage = document.getElementById('emptyCartMessage');

document.addEventListener('DOMContentLoaded', () => {
    // পেজ লোড হলেই কার্টের তথ্য লোড করা
    loadCartItems();
    
    // ইভেন্ট ডেলিগেশন: Quantity পরিবর্তন বা Remove বাটনে ক্লিক (একবার সেটআপ করলেই হবে)
    cartTableBody.addEventListener('click', (event) => {
        const target = event.target;
        // ইভেন্টটি কোন টেবিল রো (tr) থেকে এসেছে, তার product-id খুঁজে বের করা
        const itemRow = target.closest('tr');
        if (!itemRow) return;

        // product-id (স্টোরেজ থেকে পাওয়া)
        const productId = itemRow.dataset.productId;
        
        if (target.closest('.btn-remove')) {
            // রিমুভ বাটনে ক্লিক
            removeCartItem(productId);
            
        } else if (target.classList.contains('btn-qty-update')) {
            // Quantity +/- বাটনে ক্লিক
            const type = target.dataset.type;
            const currentQuantityInput = itemRow.querySelector('.cart-item-qty');
            let currentQuantity = parseInt(currentQuantityInput.value);
            
            if (type === 'plus') {
                currentQuantity += 1;
            } else if (type === 'minus' && currentQuantity > 1) {
                currentQuantity -= 1;
            } else if (type === 'minus' && currentQuantity === 1) {
                // ১ থেকে কমাতে চাইলে পণ্যটি রিমুভ করা
                removeCartItem(productId);
                return;
            }
            
            // Quantity আপডেট
            updateCartItem(productId, currentQuantity);
        }
    });
});


/**
 * লোকাল স্টোরেজ থেকে কার্ট লোড করা, রেন্ডার করা এবং টোটাল গণনা করা।
 */
function loadCartItems() {
    // লোকাল স্টোরেজ থেকে ডেটা লোড করা
    const storedItems = localStorage.getItem('cartItems');
    cartItems = storedItems ? JSON.parse(storedItems) : [];
    
    let subtotal = 0;
    cartTableBody.innerHTML = ''; // তালিকা পরিষ্কার

    if (cartItems.length === 0) {
        // কার্ট খালি থাকলে মেসেজ দেখানো
        if (emptyCartMessage) emptyCartMessage.style.display = 'table-row';
        checkoutButton.classList.add('disabled');
        subtotal = 0;
    } else {
        // কার্ট খালি না থাকলে মেসেজ লুকিয়ে ফেলা
        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        checkoutButton.classList.remove('disabled');
        
        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            // প্রতিটি পণ্যের জন্য HTML রো তৈরি করা
            const rowHTML = `
                <tr data-product-id="${item.id || item.name}"> 
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="assets/media/images/product-placeholder-1.jpg" alt="${item.name}" class="rounded me-3 d-none d-sm-block">
                            <h6 class="mb-0 fw-semibold">${item.name}</h6>
                        </div>
                    </td>
                    <td class="text-center">৳ ${item.price.toFixed(2)}</td>
                    <td class="text-center">
                        <div class="input-group input-group-sm justify-content-center quantity-control">
                            <button class="btn btn-outline-secondary btn-qty-update" type="button" data-type="minus">-</button>
                            <input type="text" class="form-control cart-item-qty" value="${item.quantity}" readonly>
                            <button class="btn btn-outline-secondary btn-qty-update" type="button" data-type="plus">+</button>
                        </div>
                    </td>
                    <td class="text-center fw-bold">৳ ${itemTotal.toFixed(2)}</td>
                    <td class="text-end">
                        <button class="btn btn-outline-danger btn-sm btn-remove" title="Remove Item">
                            <i class="fas fa-times"></i>
                        </button>
                    </td>
                </tr>
            `;
            cartTableBody.innerHTML += rowHTML;
        });
    }

    // টোটাল আপডেট করা
    cartSubtotalElement.textContent = `৳ ${subtotal.toFixed(2)}`;
    cartTotalElement.textContent = `৳ ${subtotal.toFixed(2)}`;
    
    // গ্লোবাল কার্ট কাউন্টার আপডেট করা
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    localStorage.setItem('cartCount', totalItems);
}


/**
 * লোকাল স্টোরেজে একটি পণ্যের পরিমাণ পরিবর্তন করে।
 */
function updateCartItem(productId, newQuantity) {
    // এখানে নাম দিয়ে আইটেম খোঁজা হচ্ছে, কারণ আপনার পূর্ববর্তী কোডে ID ছিল না।
    const itemIndex = cartItems.findIndex(item => item.id === productId || item.name === productId);
    
    if (itemIndex > -1) {
        cartItems[itemIndex].quantity = newQuantity;
        // লোকাল স্টোরেজ আপডেট
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        // পুরো তালিকা পুনরায় লোড করা
        loadCartItems(); 
    }
}

/**
 * লোকাল স্টোরেজ থেকে একটি পণ্য রিমুভ করে।
 */
function removeCartItem(productId) {
    // নাম অথবা ID দিয়ে পণ্য ফিল্টার করা
    cartItems = cartItems.filter(item => item.id !== productId && item.name !== productId);
    
    // লোকাল স্টোরেজ আপডেট
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    // পুরো তালিকা পুনরায় লোড করা
    loadCartItems(); 
}

// দ্রষ্টব্য: আপনার index.html/products.html এ যখন "Add to Cart" করেন, তখন
// product-id বা product-name কে data-product-id অ্যাট্রিবিউট হিসেবে সেট করুন। 
// এই কোডটি product-name কে আইডেন্টিফায়ার হিসেবে ব্যবহার করছে।