const express = require("express")

const mongodb = require("./database/mongodb")
const app = express()
require("dotenv").config({ quiet: true })

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World!")
})
app.use("/contacts", require("./routes/contacts"))

const port = process.env.PORT || 3000

startServer(port)

async function startServer(port) {
    await mongodb.initdb()

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`)
    })
}