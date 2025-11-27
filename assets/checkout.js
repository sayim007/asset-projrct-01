// File: checkout.js

document.addEventListener('DOMContentLoaded', () => {
    
    // DOM উপাদান নির্বাচন করা
    const orderItemsList = document.getElementById('orderItemsList');
    const subtotalElement = document.getElementById('subtotal');
    const shippingCostElement = document.getElementById('shippingCost');
    const totalAmountElement = document.getElementById('totalAmount');
    const cartCountBadge = document.getElementById('cartCountBadge');
    const checkoutForm = document.getElementById('checkoutForm');
    const orderConfirmation = document.getElementById('orderConfirmation');
    const placeOrderButton = document.getElementById('placeOrderButton');
    
    // প্রাথমিক শিপিং খরচ সেট করা
    const SHIPPING_COST = 100.00; // আপনি আপনার প্রয়োজন অনুযায়ী পরিবর্তন করতে পারেন
    shippingCostElement.textContent = `৳ ${SHIPPING_COST.toFixed(2)}`;

    let cartItems = [];
    let subtotal = 0;

    /**
     * লোকাল স্টোরেজ থেকে কার্টের পণ্য লোড করা এবং সামারি আপডেট করা
     */
    function loadCartAndSummary() {
        // লোকাল স্টোরেজ থেকে পণ্য ডেটা লোড করা
        const storedItems = localStorage.getItem('cartItems');
        cartItems = storedItems ? JSON.parse(storedItems) : [];

        if (cartItems.length === 0) {
            orderItemsList.innerHTML = '<li class="list-group-item text-center text-danger">Your cart is empty!</li>';
            subtotal = 0;
            placeOrderButton.disabled = true; // কার্ট খালি থাকলে অর্ডার বাটন ডিজেবল
        } else {
            orderItemsList.innerHTML = ''; // তালিকা পরিষ্কার করা
            subtotal = 0;

            cartItems.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                // প্রতিটি পণ্যের জন্য HTML তৈরি করা
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between lh-sm';
                li.innerHTML = `
                    <div>
                        <h6 class="my-0">${item.name}</h6>
                        <small class="text-muted">Qty: ${item.quantity} x ৳ ${item.price.toFixed(2)}</small>
                    </div>
                    <span class="text-muted">৳ ${itemTotal.toFixed(2)}</span>
                `;
                orderItemsList.appendChild(li);
            });
            
            placeOrderButton.disabled = false;
        }

        // মোট হিসাব করা
        const totalAmount = subtotal + SHIPPING_COST;
        
        // DOM আপডেট করা
        subtotalElement.textContent = `৳ ${subtotal.toFixed(2)}`;
        totalAmountElement.textContent = `৳ ${totalAmount.toFixed(2)}`;
        cartCountBadge.textContent = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    }

    /**
     * ফর্ম সাবমিট হলে অর্ডার প্রক্রিয়া করা
     */
    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault(); // ডিফল্ট সাবমিট বন্ধ করা

        if (cartItems.length === 0) {
            alert('Your cart is empty. Please add items to place an order.');
            return;
        }

        // ফর্ম থেকে ডেটা সংগ্রহ করা
        const orderData = {
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            area: document.getElementById('area').value,
            paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').id,
            items: cartItems,
            subtotal: subtotal,
            shippingCost: SHIPPING_COST,
            total: subtotal + SHIPPING_COST,
            orderDate: new Date().toISOString()
        };

        // --- অর্ডার ডেটা প্রসেসিং (ব্যাক-এন্ড সিমুলেশন) ---
        
        // বাস্তব জগতে, এই ডেটা একটি সার্ভারে পাঠানো হবে (API Call)
        console.log('--- Order Placed (Data Sent to Server) ---');
        console.log(orderData);
        // ----------------------------------------------------

        // ফ্রন্ট-এন্ড সফলতার বার্তা প্রদর্শন
        checkoutForm.classList.add('d-none'); // ফর্ম লুকিয়ে ফেলা
        orderConfirmation.classList.remove('d-none'); // কনফার্মেশন বার্তা দেখানো
        
        // কার্ট ডেটা লোকাল স্টোরেজ থেকে পরিষ্কার করা
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartCount');
        
        // হোমপেজের কার্ট কাউন্টার আপডেট করার জন্য রিলোড করা
        if (document.querySelector('.fa-cart-shopping')) {
             document.querySelector('.fa-cart-shopping').previousElementSibling.textContent = '0';
        }
    });

    // পেজ লোড হলেই কার্টের তথ্য লোড করা
    loadCartAndSummary();
});