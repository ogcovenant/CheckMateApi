//app imports
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

//cors whitelist import
import corsWhitelist from "./config/corsWhitelist"

//verify JWT middleware import
import verifyUser from "./middlewares/verifyUser";

//app configurations
dotenv.config()
const app = express();
const PORT = process.env.PORT;
app.use(cors({
  origin: ( origin, cb ) => {
    if (corsWhitelist.includes(origin) || !origin) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed by CORS'))
    }
  }
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())


//route imports
import { router as authRoute } from "./routes/authRoute";
import { router as taskRoute } from "./routes/taskRoute"


//route usage
app.use(authRoute)

//routes that uses the verifyUser middleware
app.use(verifyUser);
app.use("/tasks",taskRoute)

//the welcome greeting at the root endpoint of the api
app.get("/", (req, res) => {
  res.status(200).send({ msg: "Welcome To CheckMate ✅" });
})


//server starts to listen for events/requests
app.listen( PORT, () => {
  console.log("Server Started on port:" + PORT);
});