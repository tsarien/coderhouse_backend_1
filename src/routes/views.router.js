import express from "express";
import ProductManager from "../managers/productManager.js";

const viewRouter = express.Router();
const productManager = new ProductManager("./src/data/products.json");

viewRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { products });
  } catch (error) {
    res.statusMessage(500).send({ message: error.message });
  }
});

viewRouter.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realtimeproducts", { products });
  } catch (error) {
    res.statusMessage(500).send({ message: error.message });
  }
});

export default viewRouter;
