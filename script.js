// Menu Data
const menuItems = [
    {
        id: 1,
        name: "Margherita Pizza",
        category: "pizza",
        price: 129,
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        desc: "Classic tomato sauce, fresh mozzarella, and basil."
    },
    {
        id: 2,
        name: "Double Cheese Burger",
        category: "burger",
        price: 99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        desc: "Two juicy patties with melted cheddar and fresh veggies."
    },
    {
        id: 3,
        name: "Salmon Sushi Roll",
        category: "sushi",
        price: 159,
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        desc: "Fresh salmon, avocado, and cucumber wrapped in seaweed."
    },
    {
        id: 4,
        name: "Pepperoni Feast",
        category: "pizza",
        price: 149,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        desc: "Loaded with spicy pepperoni and extra mozzarella."
    },
    {
        id: 5,
        name: "BBQ Chicken Burger",
        category: "burger",
        price: 119,
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        desc: "Grilled chicken with tangy BBQ sauce and crispy onions."
    },
    {
        id: 6,
        name: "Dragon Roll",
        category: "sushi",
        price: 189,
        image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        desc: "Shrimp tempura, eel, and avocado with unagi sauce."
    }
];

// DOM Elements
const menuContainer = document.getElementById('menu-container');
const cartSidebar = document.getElementById('cart-sidebar');
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalAmount = document.getElementById('cart-total-amount');
const cartCount = document.querySelector('.cart-count');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.querySelector('.search-bar input');

// Cart State
let cart = [];

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    displayMenuItems(menuItems);
});

// Display Menu Items
function displayMenuItems(items) {
    menuContainer.innerHTML = items.map(item => `
        <div class="menu-item" data-id="${item.id}">
            <div class="item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-info">
                <h3>${item.name}</h3>
                <p class="item-desc">${item.desc}</p>
                <div class="item-footer">
                    <span class="price">₹${item.price.toFixed(2)}</span>
                    <div class="add-btn" onclick="addToCart(${item.id})">
                        <i class="fas fa-plus"></i>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Cart Sidebar Logic
cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('open');
    overlay.classList.add('show');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('show');
});

overlay.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('show');
});

// Add to Cart
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    const cartItem = cart.find(i => i.id === id);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCart();
    
    // Animation effect for cart button
    cartBtn.classList.add('shake');
    setTimeout(() => cartBtn.classList.remove('shake'), 500);
}

// Update Cart UI
function updateCart() {
    // Update count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update list
    cartItemsContainer.innerHTML = cart.length === 0 
        ? '<p style="text-align: center; color: #888;">Your cart is empty</p>'
        : cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
                    <div class="quantity-controls">
                        <button onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');

    // Update total
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotalAmount.textContent = `₹${total.toFixed(2)}`;
}

// Change Quantity
window.changeQuantity = (id, change) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    updateCart();
};

// Filtering
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const filter = e.target.dataset.filter;
        
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter items
        const filteredItems = filter === 'all' 
            ? menuItems 
            : menuItems.filter(item => item.category === filter);
        
        displayMenuItems(filteredItems);
    });
});

// Search
searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    const filteredItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(value) || 
        item.desc.toLowerCase().includes(value)
    );
    displayMenuItems(filteredItems);
});

// CSS Injection for Shake Animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0% { transform: scale(1); }
        25% { transform: scale(1.2); }
        50% { transform: scale(0.9); }
        75% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    .shake {
        animation: shake 0.5s ease;
    }
`;
document.head.appendChild(style);
