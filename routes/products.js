const router = require("express").Router();
const ctrl = require("../controllers");
const {auth,admin} = require('../middleware/auth');

router.get("/",ctrl.products.index);
router.get("/:id",ctrl.products.show);
router.post("/", auth , admin ,ctrl.products.create);
router.put("/:id", auth , admin ,ctrl.products.update);
router.delete("/:id", auth , admin ,ctrl.products.destroy);

module.exports = router;