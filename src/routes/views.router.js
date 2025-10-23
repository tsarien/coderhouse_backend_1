import express from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const viewsRouter = express.Router();

const parseQueryFilter = (query) => {
  if (!query) return {};
  try {
    return JSON.parse(query);
  } catch {
    // Permite querys como "category:Electrónica" o "status:true"
    if (query.includes(":")) {
      const [field, value] = query.split(":");
      if (field === "category") return { category: value };
      if (field === "status") return { status: value === "true" };
    }
    return { category: query };
  }
};

const buildQueryString = (params) => {
  // Filtrar solo parámetros con valores válidos
  const validParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      validParams[key] = value;
    }
  }
  const search = new URLSearchParams(validParams);
  return search.toString();
};

viewsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = parseQueryFilter(query);

    const options = {
      limit: +limit,
      page: +page,
      lean: true,
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
    };

    const result = await Product.paginate(filter, options);

    // Solo incluir parámetros que tienen valores
    const baseParams = { limit };
    if (sort) baseParams.sort = sort;
    if (query) baseParams.query = query;

    const buildUrl = (pageNum) =>
      `/?${buildQueryString({ ...baseParams, page: pageNum })}`;

    const pages = Array.from({ length: result.totalPages }, (_, i) => ({
      number: i + 1,
      url: buildUrl(i + 1),
      isCurrent: i + 1 === result.page,
    }));

    const prevLink = result.hasPrevPage ? buildUrl(result.prevPage) : null;
    const nextLink = result.hasNextPage ? buildUrl(result.nextPage) : null;

    const limitOptions = [5, 10, 20, 50].map((v) => ({
      value: v,
      selected: +limit === v,
    }));

    const sortOptions = [
      { value: "", label: "Sin orden", selected: !sort },
      { value: "asc", label: "Menor a mayor", selected: sort === "asc" },
      { value: "desc", label: "Mayor a menor", selected: sort === "desc" },
    ];

    res.render("home", {
      products: result.docs,
      currentPage: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink,
      pages,
      limitOptions,
      sortOptions,
      query: query || "",
    });
  } catch (error) {
    res.status(500).render("error", {
      message: "Error al cargar los productos",
      error: error.message,
    });
  }
});

viewsRouter.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product)
      return res
        .status(404)
        .render("error", { message: "Producto no encontrado" });
    res.render("productDetail", { product });
  } catch (error) {
    res.status(500).render("error", {
      message: "Error al cargar el detalle del producto",
      error: error.message,
    });
  }
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!cart)
      return res
        .status(404)
        .render("error", { message: "Carrito no encontrado" });

    const productsWithSubtotal = cart.products.map((item) => {
      const subtotal = item.product.price * item.quantity;
      return { ...item, subtotal: subtotal.toFixed(2) };
    });

    const total = productsWithSubtotal.reduce(
      (sum, item) => sum + parseFloat(item.subtotal),
      0
    );

    res.render("cart", {
      cartId: req.params.cid,
      products: productsWithSubtotal,
      total: total.toFixed(2),
      hasProducts: cart.products.length > 0,
    });
  } catch (error) {
    res.status(500).render("error", {
      message: "Error al cargar el carrito",
      error: error.message,
    });
  }
});

export default viewsRouter;
