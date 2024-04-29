const express = require("express");

require("dotenv").config()
const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).send({ msg: "Welcome To CheckMate ✅" })
})



app.listen( PORT, () => {
  console.log("Server Started on port:" + PORT);
});