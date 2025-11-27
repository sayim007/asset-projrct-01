// 1. কার্ট কাউন্টার ফাংশনালিটি শুরু
    
// কার্ট আইকনে থাকা সংখ্যা (badge) এবং "Add to Cart" বাটনগুলো নির্বাচন করা
const cartCounter = document.querySelector('.fa-cart-shopping').previousElementSibling; // কার্ট ব্যাজ
const addToCartButtons = document.querySelectorAll('.card-body .btn-dark'); // 'Add to Cart' বাটন

// লোড হওয়ার সময় লোকাল স্টোরেজ থেকে কার্ট সংখ্যা নিয়ে আসা
let cartItemCount = parseInt(localStorage.getItem('cartCount')) || 0;
cartCounter.textContent = cartItemCount;

// কার্ট আইকনের মধ্যে ব্যাজ ডিসপ্লে আপডেট করার জন্য ফাংশন
function updateCartCounter(count) {
    cartCounter.textContent = count;
    // লোকাল স্টোরেজে সংখ্যাটি সংরক্ষণ করা
    localStorage.setItem('cartCount', count);
}

// প্রত্যেকটি 'Add to Cart' বাটনে ইভেন্ট লিসেনার যোগ করা
addToCartButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault(); // ফর্ম সাবমিট/লিংক অ্যাকশন বন্ধ করা

        // কার্ট সংখ্যা বৃদ্ধি করা
        cartItemCount += 1;
        updateCartCounter(cartItemCount);

        // ব্যবহারকারীকে জানানোর জন্য বাটন টেক্সট পরিবর্তন করা
        this.textContent = 'Added!';
        this.classList.remove('btn-dark');
        this.classList.add('btn-success');

        // কিছু সময় পর বাটনটিকে পূর্বের অবস্থায় ফিরিয়ে আনা
        setTimeout(() => {
            this.textContent = 'Add to Cart';
            this.classList.remove('btn-success');
            this.classList.add('btn-dark');
        }, 1000);
        
        // 2. পণ্য ডেটা সংগ্রহ করা (অস্থায়ী)
        const card = this.closest('.card');
        if (card) {
            const productName = card.querySelector('.card-title').textContent.trim();
            const productPriceText = card.querySelector('.text-success').textContent.trim();
            
            // মূল্য থেকে '৳' চিহ্ন ও কমা সরিয়ে সংখ্যায় রূপান্তর করা
            const productPrice = parseFloat(productPriceText.replace('৳', '').replace(/,/g, ''));

            const product = {
                name: productName,
                price: productPrice,
                quantity: 1
            };
            
            // লোকাল স্টোরেজে পণ্য সংরক্ষণ করা
            saveProductToCart(product);
        }
    });
});

// লোকাল স্টোরেজে কার্টের পণ্য ডেটা সংরক্ষণ করার ফাংশন
function saveProductToCart(product) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // পণ্যটি যদি ইতিমধ্যেই কার্টে থাকে, তবে শুধুমাত্র তার পরিমাণ (quantity) বৃদ্ধি করা
    const existingProduct = cartItems.find(item => item.name === product.name);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cartItems.push(product);
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    console.log('Current Cart Items:', cartItems); // Console-এ দেখা যাবে
}

// 3. নিউজলেটার সাবস্ক্রিপশন ফাংশনালিটি
const newsletterForm = document.querySelector('.bg-primary form');
if(newsletterForm) {
    newsletterForm.addEventListener('submit', function(event) {
        event.preventDefault(); // ফর্ম সাবমিট হওয়া আটকানো

        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        if (email) {
            // সাবস্ক্রিপশন ডেটা সাধারণত সার্ভারে পাঠানো হয়। 
            // এখানে শুধু ফ্রন্ট-এন্ডে মেসেজ দেখানো হলো।
            alert(`Thank you for subscribing with: ${email}`);
            emailInput.value = ''; // ইনপুট খালি করা
        }
    });
}