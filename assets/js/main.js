document.addEventListener("DOMContentLoaded", () => {
  window.dataLayer = window.dataLayer || [];

  const cart = [];
  const cartBtn = document.querySelector(".cart-btn");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartDrawerBody = document.getElementById("cartDrawerBody");
  const cartSubtotalAmount = document.getElementById("cartSubtotalAmount");
  const cartBadge = document.querySelector(".cart-badge");
  const cartTotalHeader = document.querySelector(".cart-total");
  const checkoutBtn = document.querySelector(".checkout-btn");

  const toggleCart = (open) => {
    cartDrawer.classList.toggle("open", open);
    cartOverlay.classList.toggle("active", open);
  };

  cartBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleCart(true);
  });

  closeCartBtn?.addEventListener("click", () => toggleCart(false));
  cartOverlay?.addEventListener("click", () => toggleCart(false));

  const renderCart = () => {
    if (cart.length === 0) {
      cartDrawerBody.innerHTML =
        '<p class="empty-cart-msg">El carrito está vacío</p>';
      cartSubtotalAmount.textContent = "$0,00";
      cartTotalHeader.textContent = "$0,00";
      cartBadge.textContent = "0";
      checkoutBtn.disabled = true;
      return;
    }

    let total = 0;
    let totalItems = 0;
    cartDrawerBody.innerHTML = "";

    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      totalItems += item.quantity;

      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";
      itemEl.innerHTML = `
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.quantity} x $${item.price.toLocaleString("es-AR")}</div>
                </div>
                <button class="remove-item-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
            `;
      cartDrawerBody.appendChild(itemEl);
    });

    cartSubtotalAmount.textContent = `$${total.toLocaleString("es-AR")}`;
    cartTotalHeader.textContent = `$${total.toLocaleString("es-AR")}`;
    cartBadge.textContent = totalItems.toString();
    checkoutBtn.disabled = false;

    document.querySelectorAll(".remove-item-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.dataset.index);
        const removed = cart.splice(idx, 1)[0];

        window.dataLayer.push({
          event: "remove_from_cart",
          ecommerce: {
            items: [{ item_name: removed.name, price: removed.price }],
          },
        });

        renderCart();
      });
    });
  };

  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      const name = card.querySelector(".product-name").textContent.trim();
      const rawPrice = card
        .querySelector(".current-price")
        .textContent.replace(/[^0-9]/g, "");
      const price = parseFloat(rawPrice);

      const existingItem = cart.find((item) => item.name === name);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: { items: [{ item_name: name, price }] },
      });

      renderCart();
      toggleCart(true);
    });
  });
});
