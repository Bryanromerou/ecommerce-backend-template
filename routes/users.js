const router = require("express").Router();
const ctrl = require("../controllers");

router.get("/",ctrl.users.index);
// router.get("/:id",ctrl.questions.show);
// router.post("/",ctrl.questions.create);
// router.put("/:id",ctrl.questions.update);
// router.delete("/:id",ctrl.questions.destroy);

module.exports = router;