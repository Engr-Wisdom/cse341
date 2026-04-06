const router = require("express").Router()
const accountController = require("../controllers/accountCont")

router.get("/", accountController.getAll)
router.get("/:id", accountController.getSingle)
router.post("/", accountController.createAccount)
router.put("/", accountController.updateAccount)
router.delete("/", accountController.deleteAccount)

module.exports = router