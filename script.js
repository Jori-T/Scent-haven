// COMPLETE UPDATED script.js
function menutoggle() {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    // Add to cart functionality
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.col-4');
            const productName = productCard.querySelector('h4').textContent;
            const productPrice = parseFloat(productCard.querySelector('p').textContent.replace('$', ''));
            const productImage = new URL(productCard.querySelector('img').src, window.location.href).href;
            
            addToCart(productName, productPrice, productImage);
        });
    });

    updateCartCount();
    loadCartItems();
});

function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();

  if (confirm(`${name} added to cart!\nView cart now?`)) {
    window.location.href = 'cart.html';
  }
}


function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || []);
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartIcon = document.querySelector('.navbar img[src*="cart"]');

    if (cartIcon) {
        let counter = cartIcon.nextElementSibling;
        if (!counter || !counter.classList.contains('cart-count')) {
            counter = document.createElement('span');
            counter.className = 'cart-count';
            cartIcon.parentNode.insertBefore(counter, cartIcon.nextSibling);
        }
        counter.textContent = count > 0 ? count : '';
    }
}

function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartTable = document.querySelector('#cart-table');
  const totalTable = document.querySelector('#total-table');

  if (!cartTable || !totalTable) return;

  // Clear existing table rows except header
  while (cartTable.rows.length > 1) cartTable.deleteRow(1);

  let subtotal = 0;

  cart.forEach(item => {
    const row = cartTable.insertRow();
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    row.innerHTML = `
      <td><img src="${item.image}" onerror="this.src='./images/placeholder.jpg'" width="80"></td>
      <td>${item.name}</td>
      <td>${item.price.toFixed(2)}</td>
      <td><input type="number" value="${item.quantity}" min="1" data-name="${item.name}"></td>
      <td>${itemTotal.toFixed(2)}</td>
      <td><a href="#" class="remove-item" data-name="${item.name}">Remove</a></td>
    `;
  });

  totalTable.innerHTML = `
    <tr><td>Subtotal</td><td>$${subtotal.toFixed(2)}</td></tr>
    <tr><td>Tax (5%)</td><td>$${(subtotal * 0.05).toFixed(2)}</td></tr>
    <tr><td><strong>Total</strong></td><td><strong>$${(subtotal * 1.05).toFixed(2)}</strong></td></tr>
  `;
}


function updateCartItem(name, quantity) {
    const cart = JSON.parse(localStorage.getItem('cart') || []);
    const item = cart.find(item => item.name === name);
    
    if (item) {
        item.quantity = quantity > 0 ? quantity : 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartCount();
    }
}

function removeCartItem(name) {
    let cart = JSON.parse(localStorage.getItem('cart') || []);
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateCartCount();
}