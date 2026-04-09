const router = require("express").Router()
const userController = require("../controllers/userCont")
const handleErrors = require("../middleware/handleErrors")
const { validateUser, validateUpdateUser } = require("../middleware/validateUser")

router.get("/", handleErrors(userController.getAll))
router.get("/:id", handleErrors(userController.getSingle))
router.post("/", validateUser, handleErrors(userController.createUser))
router.put("/:id", validateUpdateUser, handleErrors(userController.updateUser))
router.delete("/:id", handleErrors(userController.deleteUser))

module.exports = router