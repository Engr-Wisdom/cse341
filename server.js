const express = require("express");

const mongodb = require("./database/mongodb");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept, Z-key"
  )
  res.setHeader("Access-Controll-Allow-Method", "GET, POST, PUT, DELETE, OPTIONS")
  next()
})

app.use("/", require("./routes/index"));

const port = 3000;

startServer(port);

async function startServer(port) {
  await mongodb.initdb();

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
