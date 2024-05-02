import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";



//verify JWT middleware import
import verifyUser from "./middlewares/verifyUser.js";

//app configurations
dotenv.config()
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())


//route imports
import { router as authRoute } from "./routes/authRoute.js";
import { router as tokenRoute } from "./routes/tokenRoute.js"
import { router as taskRoute } from "./routes/taskRoute.js"
import { router as listRoute } from "./routes/listRoute.js";


//route usage
app.use(authRoute)
app.use("/token", tokenRoute)

//routes that uses the verifyUser middleware
app.use(verifyUser);
app.use("/tasks",taskRoute)
app.use("/lists", listRoute)



app.get("/", (req, res) => {
  res.status(200).send({ msg: "Welcome To CheckMate ✅" });
})



app.listen( PORT, () => {
  console.log("Server Started on port:" + PORT);
});