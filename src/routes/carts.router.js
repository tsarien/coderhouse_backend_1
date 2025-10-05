import express from "express";
import CartManager from "../managers/cartManager.js";

const cartsRouter = express.Router();
const cartManager = new CartManager("./src/data/carts.json");

cartsRouter.post("/", async (req, res) => {
  try {
    const carts = await cartManager.addCart();
    res.status(201).json({ message: "Carrito creado", carts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);
    res.status(200).json({ message: "Carrito encontrado", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const carts = await cartManager.addProductByCartId(cid, pid);
    res.status(200).json({
      message: "Producto agregado al carrito con éxito",
      carts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default cartsRouter;
