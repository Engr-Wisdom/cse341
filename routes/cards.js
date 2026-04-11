const router = require("express").Router()
const cardController = require("../controllers/cardCont")
const { validateCard, validateUpdateCard } = require("../middleware/validateCard")
const handleErrors = require("../middleware/handleErrors")

router.get("/", handleErrors(cardController.getAll))
router.get("/:id", handleErrors(cardController.getSingle))
router.post("/", validateCard, handleErrors(cardController.createCard))
router.put("/:id", validateUpdateCard, handleErrors(cardController.updateCard))
router.delete("/:id", handleErrors(cardController.deleteCard))
router.post("/:id/activate", handleErrors(cardController.activateCard))

module.exports = router