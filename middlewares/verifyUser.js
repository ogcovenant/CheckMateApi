import jwt from "jsonwebtoken"
import STATUS from "../config/statusConfig.js";
import dotenv from "dotenv"

dotenv.config()


const verifyUser = ( req, res, next ) => {
  const header = req.headers["authorization"];

  if(!header) return res.sendStatus(STATUS.forbidden)

  const token = header.split(" ")[1];

  if(!token) return res.sendStatus(STATUS.unauthorized)


  try{

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, ( err, decoded ) => {
  
      if(err) throw new Error(err)

      req.user = {
        id: decoded.id,
        email: decoded.email
      }
    })
  
    next();

  }catch(err){

    if(err){
      return res.status(STATUS.forbidden).json({ error: "Invalid Token" })
    }

  }
}

export default verifyUser