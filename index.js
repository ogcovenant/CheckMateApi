import express from "express"
import dotenv from "dotenv"

//app configurations
dotenv.config()
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//route imports
import { router as authRoute } from "./routes/authRoute.js";

//route usage
app.use(authRoute)

app.get("/", (req, res) => {
  res.status(200).send({ msg: "Welcome To CheckMate ✅" });
})



app.listen( PORT, () => {
  console.log("Server Started on port:" + PORT);
});