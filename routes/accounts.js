const router = require("express").Router()
const accountController = require("../controllers/accountCont")
const { validateAccount, validateUpdateAccount } = require("../middleware/validateAccount")
const handleError = require("../middleware/handleErrors")

router.get("/", handleError(accountController.getAll))
router.get("/:id", handleError(accountController.getSingle))
router.post("/", validateAccount, handleError(accountController.createAccount))
router.put("/:id", validateUpdateAccount, handleError(accountController.updateAccount))
router.delete("/:id", handleError(accountController.deleteAccount))

module.exports = router