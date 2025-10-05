// src/app.js
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

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Handlebars config
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Routes
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// WebSocket connection
io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  // Enviar lista actual de productos al conectarse
  const products = await productManager.getProducts();
  socket.emit("updateProducts", products);
});

app.set("io", io); // Guardamos io en la app para usarlo en los routers

server.listen(8080, () => {
  console.log("Servidor iniciado en puerto 8080");
});
