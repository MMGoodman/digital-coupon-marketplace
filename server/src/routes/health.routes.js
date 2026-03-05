const router = require("express").Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Digital Coupon Marketplace API is running" });
});

module.exports = router;