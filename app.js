import express from "express";
import ProductManager from "./productManager.js";
import CartManager from "./cartManager.js";

const app = express();
//habilitamos poder recibir json en nuestro servidor - middleware
app.use(express.json());
const productManager = new ProductManager("./products.json");
const cartManager = new CartManager("./carts.json");

app.get("/", (req, res) => {
  res.send("Hola mundo!");
});

// /api/products

app.get("/api/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json({ message: "Lista de productos", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const products = await productManager.deleteProductById(pid);
    res.status(200).json({ message: "Producto eliminado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const newProduct = req.body;
    const products = await productManager.addProduct(newProduct);
    res.status(201).json({ message: "Producto añadido", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updates = req.body;

    const products = await productManager.setProductById(pid, updates);
    res.status(200).json({ message: "Producto actualizado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//devolver un producto buscado a traves de su id
app.get("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const products = await productManager.getProductById(pid);
    res.status(200).json({ message: "Producto encontrado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// /api/carts

//este metodo crea carritos vacios
app.post("/api/carts", async (req, res) => {
  try {
    const newCart = req.body;
    const carts = await cartManager.addCart(newCart);
    res.status(201).json({ message: "Carrito creado", carts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//este metodo trae los productos de un carrito elegido por su id
app.get("/api/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const carts = await cartManager.getCartById(cid);
    res.status(200).json({ message: "Carrito encontrado", carts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
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

app.listen(8080, () => {
  console.log("Servidor iniciado correctamente!");
});
