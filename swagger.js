const swaggerAutogen = require("swagger-autogen")

const docs = {
    info: {
        title: "Users API",
        description: "Users API"
    },
    host: "localhost:3000",
    schemas: ["https", "http"]
}

const outputFile = "./swagger.json"
const endpontsFile = ["./routes/index.js"]

swaggerAutogen(outputFile, endpontsFile, docs)