document.addEventListener("DOMContentLoaded", () => {
  window.dataLayer = window.dataLayer || [];

  // Estado y elementos del Carrito Lateral
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
    cartDrawer?.classList.toggle("open", open);
    cartOverlay?.classList.toggle("active", open);
  };

  cartBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleCart(true);
  });

  closeCartBtn?.addEventListener("click", () => toggleCart(false));
  cartOverlay?.addEventListener("click", () => toggleCart(false));

  const renderCart = () => {
    if (!cartDrawerBody) return;

    if (cart.length === 0) {
      cartDrawerBody.innerHTML =
        '<p class="empty-cart-msg">El carrito está vacío</p>';
      if (cartSubtotalAmount) cartSubtotalAmount.textContent = "$0,00";
      if (cartTotalHeader) cartTotalHeader.textContent = "$0,00";
      if (cartBadge) cartBadge.textContent = "0";
      if (checkoutBtn) checkoutBtn.disabled = true;
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

    if (cartSubtotalAmount)
      cartSubtotalAmount.textContent = `$${total.toLocaleString("es-AR")}`;
    if (cartTotalHeader)
      cartTotalHeader.textContent = `$${total.toLocaleString("es-AR")}`;
    if (cartBadge) cartBadge.textContent = totalItems.toString();
    if (checkoutBtn) checkoutBtn.disabled = false;

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

  // Evento Agregar al Carrito
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      if (!card) return;

      const name =
        card.querySelector(".product-name")?.textContent.trim() || "Producto";
      const rawPrice =
        card
          .querySelector(".current-price")
          ?.textContent.replace(/[^0-9]/g, "") || "0";
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

  // Filtro Rango de Precio
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");

  priceRange?.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    if (priceValue) priceValue.textContent = `$${val.toLocaleString("es-AR")}`;

    window.dataLayer.push({
      event: "filter_price_change",
      max_price: val,
    });
  });
});
