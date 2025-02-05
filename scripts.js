// Products
const products = [
    { id: 1, name: 'Sporty Shoe', price: 50, image: 'shoe1.jpg' },
    { id: 2, name: 'Casual Shoe', price: 70, image: 'shoe2.jpeg' },
    { id: 3, name: 'Running Shoe', price: 80, image: 'shoe3.jpeg' },
];

let cart = [];

// Add to Cart Functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const productId = e.target.parentElement.getAttribute('data-id');
        addToCart(Number(productId));
    });
});

// Add item to cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
        cartItem.quantity++; // Increment quantity instead of creating duplicate entry
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

// Update cart UI and total
function updateCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartButton = document.getElementById('cartButton');
    let totalPrice = 0;
    cartItemsDiv.innerHTML = '';

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p class='empty-cart'>Your cart is empty.</p>";
    }

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="cart-item-container">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                    <div class="quantity">
                        <button class="decrease" onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase" onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `;
        cartItemsDiv.appendChild(cartItem);
    });

    document.getElementById('totalPrice').innerText = `$${totalPrice}`;
    cartButton.innerText = `Cart (${cart.length})`;
}

// Change item quantity
function changeQuantity(id, delta) {
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        cartItem.quantity += delta;
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
    }
    updateCart();
}

// Show and Hide Cart
document.getElementById('cartButton').addEventListener('click', () => {
    document.getElementById('cartModal').style.display = 'flex';
});

document.getElementById('closeCart').addEventListener('click', () => {
    document.getElementById('cartModal').style.display = 'none';
});

document.getElementById('checkoutButton').addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const orderDetails = {
        customer: "Hrithik Manoj Nair",  // You can dynamically change this
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };

    // Send order to backend
    fetch('https://backend-0zmt.onrender.com/place-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderDetails)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Order Response:", data);
        alert("🎉 Order Placed Successfully! 🎉");

        // Clear the cart after checkout
        cart = [];
        updateCart();
    })
    .catch(error => {
        console.error("Error placing order:", error);
        alert("⚠️ Failed to place order. Try again later.");
    });
});



