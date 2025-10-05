import express from "express";
import http from "http";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import ProductManager from "./managers/productManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const productManager = new ProductManager("./src/data/products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  const products = await productManager.getProducts();
  socket.emit("updateProducts", products);
});

app.set("io", io);

server.listen(8080, () => {
  console.log("Servidor iniciado en puerto 8080");
});
