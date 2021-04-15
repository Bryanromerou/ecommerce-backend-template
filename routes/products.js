const router = require("express").Router();
const ctrl = require("../controllers");

router.get("/",ctrl.products.index);
router.get("/:id",ctrl.products.show);
// router.post("/",ctrl.users.create);
// router.put("/:id",ctrl.questions.update);
// router.delete("/:id",ctrl.questions.destroy);

module.exports = router;