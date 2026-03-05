const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    value_type: { type: String, enum: ["STRING", "IMAGE"], required: true },
    value: { type: String, required: true }
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image_url: { type: String, required: true },

    cost_price: { type: Number, required: true, min: 0 },
    margin_percentage: { type: Number, required: true, min: 0 },
    minimum_sell_price: { type: Number, required: true, min: 0 },

    is_sold: { type: Boolean, default: false },
    is_deleted: { type: Boolean, default: false },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },

    coupon: { type: CouponSchema, required: true }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Product", ProductSchema);