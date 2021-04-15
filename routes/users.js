const router = require("express").Router();
const ctrl = require("../controllers");

router.post("/login",ctrl.users.login);//Register Route
router.get("/",ctrl.users.index);
router.get("/:id",ctrl.users.show);
router.post("/",ctrl.users.create);//Register Route
// router.put("/:id",ctrl.users.update);
// router.delete("/:id",ctrl.users.destroy);

module.exports = router;