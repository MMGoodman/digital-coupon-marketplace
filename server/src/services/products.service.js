const Product = require("../models/product.model");
const { calcMinimumSellPrice } = require("./pricing.service");

async function createProduct({ name, description, image_url, cost_price, margin_percentage, coupon }) {
  const cost = Number(cost_price);
  const margin = Number(margin_percentage);

  const product = await Product.create({
    name,
    description: description || "",
    image_url,
    cost_price: cost,
    margin_percentage: margin,
    minimum_sell_price: calcMinimumSellPrice(cost, margin),
    is_sold: false,
    is_deleted: false,
    created_at: new Date(),
    updated_at: new Date(),
    coupon
  });

  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    image_url: product.image_url,
    cost_price: product.cost_price,
    margin_percentage: product.margin_percentage,
    minimum_sell_price: product.minimum_sell_price,
    is_sold: product.is_sold,
    is_deleted: product.is_deleted,
    created_at: product.created_at,
    updated_at: product.updated_at,
    coupon: product.coupon
  };
} 

async function listAvailableForReseller() {
  const docs = await Product.find({ is_deleted: false, is_sold: false })
    .select("_id name description image_url minimum_sell_price")
    .lean();

  return docs.map((p) => ({
    id: String(p._id),
    name: p.name,
    description: p.description,
    image_url: p.image_url,
    price: p.minimum_sell_price
  }));
}

async function getAvailableForReseller(productId) {
  const p = await Product.findOne({ _id: productId, is_deleted: false, is_sold: false })
    .select("_id name description image_url minimum_sell_price")
    .lean();

  if (!p) return null;

  return {
    id: String(p._id),
    name: p.name,
    description: p.description,
    image_url: p.image_url,
    price: p.minimum_sell_price
  };
}

async function purchaseAsReseller(productId, resellerPrice) {
  const price = Number(resellerPrice);
  if (!Number.isFinite(price)) return { error: "BAD_PRICE" };

  const product = await Product.findOne({ _id: productId, is_deleted: false }).lean();
  if (!product) return { error: "NOT_FOUND" };

  if (product.is_sold) return { error: "ALREADY_SOLD" };
  if (price < product.minimum_sell_price) return { error: "TOO_LOW", min: product.minimum_sell_price };

  const updated = await Product.findOneAndUpdate(
    { _id: productId, is_deleted: false, is_sold: false },
    { $set: { is_sold: true, updated_at: new Date() } },
    { new: true }
  ).lean();

  if (!updated) return { error: "ALREADY_SOLD" };

  return {
    ok: true,
    data: {
      product_id: String(updated._id),
      final_price: Math.round(price * 100) / 100,
      value_type: updated.coupon.value_type,
      value: updated.coupon.value
    }
  };
}

module.exports = {
  createProduct,
  listAvailableForReseller,
  getAvailableForReseller,
  purchaseAsReseller
};