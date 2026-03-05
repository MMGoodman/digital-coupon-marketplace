const { createProduct } = require("../services/products.service");

function error(res, status, code, message) {
  return res.status(status).json({ error_code: code, message });
}

async function create(req, res) {
  const {
    name,
    description,
    image_url,
    cost_price,
    margin_percentage,
    coupon_value_type,
    coupon_value
  } = req.body || {};

  if (!name || typeof name !== "string")
    return error(res, 400, "VALIDATION_ERROR", "name is required");

  if (!image_url || typeof image_url !== "string")
    return error(res, 400, "VALIDATION_ERROR", "image_url is required");

  const cost = Number(cost_price);
  const margin = Number(margin_percentage);

  if (!Number.isFinite(cost) || cost < 0)
    return error(res, 400, "VALIDATION_ERROR", "cost_price must be >= 0");

  if (!Number.isFinite(margin) || margin < 0)
    return error(res, 400, "VALIDATION_ERROR", "margin_percentage must be >= 0");

  if (coupon_value_type !== "STRING" && coupon_value_type !== "IMAGE") {
    return error(res, 400, "VALIDATION_ERROR", "coupon_value_type must be STRING or IMAGE");
  }

  if (!coupon_value || typeof coupon_value !== "string") {
    return error(res, 400, "VALIDATION_ERROR", "coupon_value is required");
  }

  const product = await createProduct({
    name,
    description,
    image_url,
    cost_price: cost,
    margin_percentage: margin,
    coupon: { value_type: coupon_value_type, value: coupon_value }
  });

  return res.status(201).json(product);
}

module.exports = { create };