const router = require("express").Router();
const ctrl = require("../controllers");
const {auth,admin} = require('../middleware/auth');


router.post("/googleLogin",ctrl.users.googleLogin);
router.post("/login",ctrl.users.login);
router.post("/makeAdmin", auth,ctrl.users.makeAdmin);
router.post("/createAdmin",ctrl.users.createAdmin);//Register Route
router.get("/", auth, admin,ctrl.users.index);
router.get("/:id",ctrl.users.show);
router.post("/",ctrl.users.create);//Register Route
// router.put("/:id",ctrl.users.update);
// router.delete("/:id",ctrl.users.destroy);

module.exports = router;