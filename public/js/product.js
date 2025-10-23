// Crear o recuperar el carrito existente
async function getOrCreateCart() {
  let cartId = localStorage.getItem("cartId");

  if (!cartId) {
    try {
      const response = await fetch("/api/carts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      cartId = data.payload._id;
      localStorage.setItem("cartId", cartId);
    } catch (error) {
      alert("Error al crear el carrito");
      return null;
    }
  }

  return cartId;
}

// Agregar producto al carrito
async function addToCart(productId) {
  const cartId = await getOrCreateCart();
  if (!cartId) return;

  const quantityInput = document.getElementById("quantity");
  const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

  try {
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });

    if (response.ok) {
      alert(`${quantity} producto(s) agregado(s) al carrito`);
      updateCartCount();

      // Mostrar botón para ver carrito
      const viewCartBtn = document.getElementById("viewCartBtn");
      if (viewCartBtn) {
        viewCartBtn.href = `/carts/${cartId}`;
        viewCartBtn.style.display = "inline-block";
      }
    } else {
      alert("Error al agregar el producto");
    }
  } catch (error) {
    alert("Error al agregar el producto al carrito");
  }
}

// Actualizar contador del carrito
async function updateCartCount() {
  const cartId = localStorage.getItem("cartId");
  if (!cartId) return;

  try {
    const response = await fetch(`/api/carts/${cartId}`);
    const data = await response.json();
    const count = data.payload.products
      ? data.payload.products.reduce((sum, item) => sum + item.quantity, 0)
      : 0;

    const cartCounter = document.getElementById("cart-count");
    if (cartCounter) cartCounter.textContent = count;
  } catch (error) {
    console.error("Error al actualizar contador del carrito:", error);
  }
}

// Mostrar botón “Ver carrito” si ya existe uno guardado
document.addEventListener("DOMContentLoaded", () => {
  const cartId = localStorage.getItem("cartId");
  if (cartId) {
    const viewCartBtn = document.getElementById("viewCartBtn");
    if (viewCartBtn) {
      viewCartBtn.href = `/carts/${cartId}`;
      viewCartBtn.style.display = "inline-block";
    }
  }

  // 🔁 Enviar formulario automáticamente al cambiar filtros
  document.getElementById("limit").addEventListener("change", () => {
    document.getElementById("filtersForm").submit();
  });
  document.getElementById("sort").addEventListener("change", () => {
    document.getElementById("filtersForm").submit();
  });

  // 🛒 Escuchar clicks en los botones de agregar al carrito
  document.querySelectorAll(".btn-add-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      addToCart(id);
    });
  });

  updateCartCount();
});
