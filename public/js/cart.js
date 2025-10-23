async function updateCartLink() {
  const cartId = localStorage.getItem("cartId");
  const cartLink = document.getElementById("cartLink");
  const cartCount = document.getElementById("cart-count");
  if (cartId) {
    cartLink.href = `/carts/${cartId}`;
    try {
      const response = await fetch(`/api/carts/${cartId}`);
      const data = await response.json();
      if (data.status === "success") {
        const totalItems = data.payload.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? "inline-block" : "none";
      }
    } catch (error) {
      console.error("Error al actualizar carrito:", error);
    }
  } else {
    cartLink.href = "/products";
    cartCount.style.display = "none";
  }
}
document.addEventListener("DOMContentLoaded", updateCartLink);

async function updateQuantity(cartId, productId, currentQuantity, change) {
  const newQuantity = currentQuantity + change;

  if (newQuantity < 1) {
    if (confirm("¿Deseas eliminar este producto del carrito?")) {
      removeFromCart(cartId, productId);
    }
    return;
  }

  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (response.ok) {
      location.reload();
    } else {
      alert("Error al actualizar la cantidad");
    }
  } catch (error) {
    alert("Error al actualizar la cantidad");
  }
}

async function updateQuantityInput(cartId, productId, newQuantity) {
  newQuantity = parseInt(newQuantity);

  if (newQuantity < 1 || isNaN(newQuantity)) {
    alert("La cantidad debe ser mayor a 0");
    return;
  }

  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (response.ok) {
      location.reload();
    } else {
      alert("Error al actualizar la cantidad");
    }
  } catch (error) {
    alert("Error al actualizar la cantidad");
  }
}

async function removeFromCart(cartId, productId) {
  if (!confirm("¿Estás seguro de eliminar este producto del carrito?")) {
    return;
  }

  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      location.reload();
    } else {
      alert("Error al eliminar el producto");
    }
  } catch (error) {
    alert("Error al eliminar el producto");
  }
}

async function clearCart(cartId) {
  if (!confirm("¿Estás seguro de vaciar todo el carrito?")) {
    return;
  }

  try {
    const response = await fetch(`/api/carts/${cartId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      location.reload();
    } else {
      alert("Error al vaciar el carrito");
    }
  } catch (error) {
    alert("Error al vaciar el carrito");
  }
}
