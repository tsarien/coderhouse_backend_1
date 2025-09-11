import crypto from "crypto";
import fs from "fs/promises";
import ProductManager from "./productManager";

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewId() {
    return crypto.randomUUID();
  }

  async addCart(newCart) {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);

      const newId = this.generateNewId();

      const cart = { id: newId, ...newCart };
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

      const filteredCart = carts.filter((cart) => cart.id !== cartId);

      return filteredCart;
    } catch (error) {}
  }

  async addProductByCartId(cartId, productId) {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);

      const filteredCart = carts.filter((cart) => cart.id !== cartId);
    } catch (error) {}
  }
}

export default CartManager;
