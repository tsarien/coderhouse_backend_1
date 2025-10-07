const socket = io();
const productList = document.getElementById("productList");
const form = document.getElementById("productForm");

const renderProducts = (products) => {
  productList.innerHTML = products
    .map(
      (p) => `
        <div class="product-card">
          <img src="${p.thumbnails}" alt="${p.title}" class="product-image">
          <div class="product-info">
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <p class="price">$${p.price}</p>
            <p>Stock: ${p.stock}</p>
            <p class="category">${p.category}</p>
            <button onclick="deleteProduct('${p.id}')" class="delete-btn">Eliminar</button>
          </div>
        </div>`
    )
    .join("");
};

socket.on("updateProducts", (products) => {
  renderProducts(products);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  await fetch("/api/products", {
    method: "POST",
    body: formData,
  });
  form.reset();
});

async function deleteProduct(id) {
  await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });
}
