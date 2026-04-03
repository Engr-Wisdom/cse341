const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contactCont");
const { validateContact } = require("../middleware/validateContact");
const handleErrors = require("../middleware/handleErrors")

router.get("/", handleErrors(contactController.getAll));
router.get("/:id", handleErrors(contactController.getSingle));
router.post("/", validateContact, handleErrors(contactController.createContact));
router.put("/:id", validateContact, handleErrors(contactController.updateContact));
router.delete("/:id", handleErrors(contactController.deleteContact));

module.exports = router;