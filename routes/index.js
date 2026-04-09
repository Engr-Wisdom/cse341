const router = require("express").Router()

const { ensureAuthenticated } = require("../middleware/auth")

router.use("/", require("./swagger"))
router.get("/", (req, res) => {
    res.send("Hello World!")
})

router.use("/contacts", ensureAuthenticated, require("./contacts"))
router.use("/transactions", ensureAuthenticated, require("./transactions"))
router.use("/accounts", ensureAuthenticated, require("./accounts"))
router.use("/users", require("./users"))

router.use((req, res) => {
    res.status(404).json({ message: "Route on found" })
})

module.exports = router