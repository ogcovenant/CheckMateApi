import jwt from "jsonwebtoken"
import STATUS from "../config/statusConfig";
import dotenv from "dotenv"

dotenv.config()


const verifyUser = ( req, res, next ) => {
  const header = req.headers["authorization"];
  const token = header.split(" ")[1];

  if(!token) return res.sendStatus(STATUS.forbidden)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, ( err, user ) => {
    if(err){
      return res.status(STATUS.forbidden).json({ error: "Invalid Token" })
    }

    req.user = user
  })

  next();
}

export default verifyUser