const router = require("express").Router();
const ctrl = require("../controllers");
const {auth,admin} = require('../middleware/auth');


router.post("/login",ctrl.users.login);//Register Route
router.post("/createAdmin",ctrl.users.createAdmin);//Register Route
router.get("/", auth, admin,ctrl.users.index);
router.get("/:id",ctrl.users.show);
router.post("/",ctrl.users.create);//Register Route
// router.put("/:id",ctrl.users.update);
// router.delete("/:id",ctrl.users.destroy);

module.exports = router;