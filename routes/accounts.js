const router = require("express").Router()
const accountController = require("../controllers/accountCont")
const { validateAccount, validateUpdateAccount } = require("../middleware/validateAccount")
const handleErrors = require("../middleware/handleErrors")

router.get("/", handleErrors(accountController.getAll))
router.get("/:id", handleErrors(accountController.getSingle))
router.post("/", validateAccount, handleErrors(accountController.createAccount))
router.put("/:id", validateUpdateAccount, handleErrors(accountController.updateAccount))
router.delete("/:id", handleErrors(accountController.deleteAccount))

module.exports = router