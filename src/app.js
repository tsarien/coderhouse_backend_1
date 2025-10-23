import express from "express";
import path from "path";
import productsRouter from "./routes/products.router.js";
import connectMongoDB from "./config/db.js";
import dotenv from "dotenv";
import cartRouter from "./routes/carts.router.js";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import __dirname from "../dirname.js";

// Inicializamos las variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src/views"));

// Conexión a MongoDB
connectMongoDB();

// Endpoints
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).render("error", {
    message: "Página no encontrada",
    error: `La ruta ${req.url} no existe`,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado correctamente en http://localhost:${PORT}`);
});
