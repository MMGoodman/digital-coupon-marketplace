require("dotenv").config();
const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const adminProductsRoutes = require("./routes/admin.products.routes");
const resellerProductsRoutes = require("./routes/reseller.products.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/admin", adminProductsRoutes);
app.use("/api/v1", resellerProductsRoutes);

module.exports = app;