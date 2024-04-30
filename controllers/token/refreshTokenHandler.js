import jwt from "jsonwebtoken"
import STATUS from "../../config/statusConfig.js";
import db from "../../config/dbconfig.js";
import dotenv from "dotenv"

dotenv.config()

export const refreshTokenHandler = async(req, res) => {
  const cookie = req.cookies;

  if(!cookie?.jwt) return res.sendStatus(STATUS.unauthorized);

  try{
    const [refreshToken] = await db.query("SELECT refresh_token FROM users WHERE refresh_token = ?", [ cookie.jwt ])

    if(!refreshToken[0]?.refresh_token) return res.sendStatus(STATUS.authRequired);

    jwt.verify(refreshToken[0]?.refresh_token, process.env.REFRESH_TOKEN_SECRET, ( err, decoded ) => {
      if(err) return res.sendStatus(STATUS.authRequired)

      req.user = {
        id: decoded.id,
        email: decoded.email
      }
    })

  }catch(err){
    return res.sendStatus(STATUS.serverError)
  }

  const accessToken = jwt.sign((req.user), process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });

  res.status(STATUS.ok).json({ accessToken: accessToken });
}

export default refreshTokenHandler