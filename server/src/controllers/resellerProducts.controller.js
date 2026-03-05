const {
  listAvailableForReseller,
  getAvailableForReseller,
  purchaseAsReseller
} = require("../services/products.service");

function error(res, status, code, message) {
  return res.status(status).json({ error_code: code, message });
}

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token || token !== (process.env.RESELLER_TOKEN || "")) {
    return error(res, 401, "UNAUTHORIZED", "Missing or invalid bearer token");
  }
  next();
}

async function list(req, res) {
  const items = await listAvailableForReseller();
  return res.json(items);
}

async function getOne(req, res) {
  const p = await getAvailableForReseller(req.params.productId);
  if (!p) return error(res, 404, "PRODUCT_NOT_FOUND", "Product not found");
  return res.json(p);
}

async function purchase(req, res) {
  const { reseller_price } = req.body || {};
  const result = await purchaseAsReseller(req.params.productId, reseller_price);

  if (result.error === "NOT_FOUND") return error(res, 404, "PRODUCT_NOT_FOUND", "Product not found");
  if (result.error === "ALREADY_SOLD") return error(res, 409, "PRODUCT_ALREADY_SOLD", "Product already sold");
  if (result.error === "BAD_PRICE") return error(res, 400, "VALIDATION_ERROR", "reseller_price must be a number");
  if (result.error === "TOO_LOW") return error(res, 400, "RESELLER_PRICE_TOO_LOW", "reseller_price is below minimum_sell_price");

  return res.json(result.data);
}

module.exports = { auth, list, getOne, purchase };