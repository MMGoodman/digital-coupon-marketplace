const router = require("express").Router();
const { auth, list, getOne, purchase } = require("../controllers/resellerProducts.controller");

router.get("/products", auth, list);
router.get("/products/:productId", auth, getOne);
router.post("/products/:productId/purchase", auth, purchase);

module.exports = router;