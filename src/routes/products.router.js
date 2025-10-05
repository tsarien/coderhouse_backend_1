import express from "express";
import ProductManager from "../managers/productManager.js";
import uploader from "../utils/uploader.js";

const productsRouter = express.Router();
const productManager = new ProductManager("./src/data/products.json");

productsRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json({ message: "Lista de productos", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

productsRouter.post("/", uploader.single("file"), async (req, res) => {
  try {
    const newProduct = req.body;
    if (req.file) {
      newProduct.thumbnails = `/img/${req.file.filename}`;
    }

    const products = await productManager.addProduct(newProduct);

    const io = req.app.get("io");
    io.emit("updateProducts", products);

    res.status(201).json({ message: "Producto añadido", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const products = await productManager.deleteProductById(pid);

    const io = req.app.get("io");
    io.emit("updateProducts", products);

    res.status(200).json({ message: "Producto eliminado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default productsRouter;
