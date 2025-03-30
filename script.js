document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("products");
  const cartItemsContainer = document.getElementById("cart-items");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  window.updateCart = function () {
    localStorage.setItem("cart", JSON.stringify(cart));
    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;
    let totalQuantity = 0;
    cart.forEach((item) => {
      totalPrice += item.price * item.quantity;
      totalQuantity += item.quantity;
      const cartItem = document.createElement("div");
      cartItem.classList.add(
        "d-flex",
        "justify-content-between",
        "align-items-center",
        "mb-2"
      );
      cartItem.innerHTML = `
                        <span>${item.title} (${item.quantity}) - ${
        item.price * item.quantity
      } €</span>
                        <div>
                            <button class="btn btn-sm btn-outline-primary" onclick="changeQuantity(${
                              item.id
                            }, 1)">+</button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${
                              item.id
                            }, -1)">-</button>
                            <button class="btn btn-sm btn-danger" onclick="removeFromCart(${
                              item.id
                            })">❌</button>
                        </div>
                    `;
      cartItemsContainer.appendChild(cartItem);
    });
    let shipping = totalQuantity > 3 ? 0 : 9.99;
    document.getElementById("total-price").textContent = totalPrice.toFixed(2);
    document.getElementById("shipping").textContent = shipping.toFixed(2);
    document.getElementById("final-price").textContent = (
      totalPrice + shipping
    ).toFixed(2);
  };

  window.addToCart = function (product) {
    let item = cart.find((p) => p.id === product.id);
    if (item) {
      item.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCart();
  };

  window.changeQuantity = function (id, delta) {
    let item = cart.find((p) => p.id === id);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        cart = cart.filter((p) => p.id !== id);
      }
    }
    updateCart();
  };

  window.removeFromCart = function (id) {
    cart = cart.filter((p) => p.id !== id);
    updateCart();
  };

  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.classList.add("col-md-4");
        productElement.innerHTML = `
                            <div class="card shadow-sm border-0">
                                <img src="${product.image}" class="card-img-top p-3" style="height: 200px; object-fit: contain;">
                                <div class="card-body text-center">
                                    <h6 class="card-title text-dark">${product.title}</h6>
                                    <p class="card-text text-primary fw-bold">${product.price} €</p>
                                    <button class="btn btn-success add-to-cart">Ajouter</button>
                                </div>
                            </div>
                        `;
        productElement
          .querySelector(".add-to-cart")
          .addEventListener("click", () => addToCart(product));
        productsContainer.appendChild(productElement);
      });
      updateCart();
    });
});
