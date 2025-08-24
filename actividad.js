class ProductManager {
  constructor() {
    this.products = [];
  }

  addProduct(newProduct) {
    const { title, description, price, thumbnail, code, stock } = newProduct;
    if (this.products.find((p) => p.code === code)) {
      return "Error: Product with this code already exists";
    } else if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock
    ) {
      return "Error: All fields are required";
    } else {
      const id = this.products.length + 1;
      const product = { id, title, description, price, thumbnail, code, stock };
      this.products.push(product);
      return `Producto ${title} added successfully`;
    }
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      console.log("Not Found");
      return null;
    }
    return product;
  }
}
