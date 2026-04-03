const router = require("express").Router()

const transactionController = require("../controllers/transactionCont")
const handleErrors = require("../middleware/handleErrors")
const { validateTransaction } = require("../middleware/validateTransaction")

router.get("/", handleErrors(transactionController.getAllTransactions))
router.get("/:id", handleErrors(transactionController.getSingleTransaction))
router.post("/", validateTransaction, handleErrors(transactionController.createTransaction))
router.put("/:id", validateTransaction, handleErrors(transactionController.updateTransaction))
router.delete("/:id", handleErrors(transactionController.deleteTransaction))

module.exports = router