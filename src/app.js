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

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Puerto de nuestro servidor
const PORT = 8080;

// Habilitamos para recibir json
app.use(express.json());

// Habilitamos la carpeta public
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

// Endpoints
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Websockets
io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  const products = await productManager.getProducts();
  socket.emit("updateProducts", products);
});

app.set("io", io);

// Iniciamos el servidor
server.listen(PORT, () =>
  console.log(`Servidor iniciado en: http://localhost:${PORT}`)
);
