const router = require("express").Router();
const { create } = require("../controllers/adminProducts.controller");

router.post("/products", create);

module.exports = router;