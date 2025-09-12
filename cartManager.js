import crypto from "crypto";
import fs from "fs/promises";

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewId() {
    return crypto.randomUUID();
  }

  async addCart() {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);

      const newId = this.generateNewId();

      const cart = { id: newId, products: [] };
      carts.push(cart);

      await fs.writeFile(
        this.pathFile,
        JSON.stringify(carts, null, 2),
        "utf-8"
      );

      return carts;
    } catch (error) {
      throw new Error("Error al crear el nuevo carrito: " + error.message);
    }
  }

  async getCartById(cartId) {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);

      const cart = carts.find((cart) => cart.id === cartId);
      if (!cart) throw new Error("Carrito no encontrado");
      return cart;
    } catch (error) {
      throw new Error("Error al buscar el carrito con el ID: " + error.message);
    }
  }

  async addProductByCartId(cartId, productId) {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);

      const cartIndex = carts.findIndex((cart) => cart.id === cartId);
      if (cartIndex === -1) throw new Error("Carrito no encontrado");

      const cart = carts[cartIndex];

      const productIndex = cart.products.findIndex((p) => p.id === productId);

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ id: productId, quantity: 1 });
      }

      carts[cartIndex] = cart;
      await fs.writeFile(
        this.pathFile,
        JSON.stringify(carts, null, 2),
        "utf-8"
      );

      return cart;
    } catch (error) {
      throw new Error(
        "Error al agregar el producto al carrito: " + error.message
      );
    }
  }
}

export default CartManager;
