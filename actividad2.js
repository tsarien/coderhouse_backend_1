const products = [
  {
    id: 1,
    title: "Auriculares Redragon",
    description: "Auriculares para pc",
    price: 159,
    thumbnail: "",
    code: "23AQ2",
    stock: 4,
  },
  {
    id: 2,
    title: "Teclado Corsair",
    description: "Teclado inalambrico",
    price: 260,
    thumbnail: "",
    code: "56GH2",
    stock: 10,
  },
];

class ProductManager {
  #admin;

  constructor(products) {
    this.products = products;
    this.#admin = true;
  }

  getProducts() {
    return { message: "Lista de products", products: this.products };
  }

  deleteProductById(productId) {
    try {
      /*   
      if(this.#admin){
        const newProducts = this.products.filter( product => product.id !== productId );
        this.products = newProducts;

        return { message: "Producto Eliminado", products: this.products };
      }else{
        throw new Error("Permiso denegado");
      }
      */
      if (!this.#admin) throw new Error("Permiso denegado");

      const newProducts = this.products.filter(
        (product) => product.id !== productId
      );
      this.products = newProducts;

      return { message: "Producto Eliminado", products: this.products };
    } catch (error) {
      console.log("Error al borrar un producto:", error.message);
    }
  }

  generateId() {
    if (this.products.length > 0) {
      return this.products[this.products.length - 1].id + 1;
    } else {
      return 1;
    }
  }

  addProduct(newProduct) {
    try {
      if (!this.#admin) throw new Error("Permiso denegado");

      const id = this.generateId();
      this.products.push({ id, ...newProduct });
      return { message: "Producto agregado", products: this.products };
    } catch (error) {
      console.log("Error al agregar un producto:", error.message);
    }
  }

  updateProductById(productId, update) {
    try {
      if (!this.#admin) throw new Error("Permiso denegado");

      const indexProduct = this.products.findIndex(
        (product) => product.id === productId
      );
      if (indexProduct === -1) throw new Error("El producto no existe");

      this.products[indexProduct] = {
        ...this.products[indexProduct],
        ...update,
      };
      return { message: "Producto Actualizado", products: this.products };
    } catch (error) {
      console.log("Error al actualizar un producto:", error.message);
    }
  }
}

function main() {
  const productManager = new ProductManager(products);

  console.log(productManager.getProducts());
  console.log(
    productManager.addProduct({
      title: "Mouse GTX",
      description: "Mouse inalambrico",
    })
  );
  console.log(productManager.deleteProductById(2));
  console.log(
    productManager.addProduct({
      title: "Monitor Asus",
      description: "Monitor 144Hz",
    })
  );
  console.log(productManager.updateProductById(1, { price: 950 }));
}

main();
