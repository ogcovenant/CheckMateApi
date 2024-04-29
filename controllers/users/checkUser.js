import Joi from "joi"
import STATUS from "../../config/statusConfig.js"
import jwt from "jsonwebtoken"
import db from "../../config/dbconfig.js"
import bcrypt from "bcryptjs"

const userSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
})

export const checkUser = async(req, res) => {
  const emailRaw = userSchema.validate({ email: req.body.email });
  const passwordRaw = userSchema.validate({ password: req.body.password });

  if(emailRaw.error|| passwordRaw.error ){
    return res.status(STATUS.bad).json({ msg: "Invalid values provided" });
  }

  const email = emailRaw.value.email;
  const password = passwordRaw.value.password;

  try{
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if(!existingUser[0]) return res.status(STATUS.conflict).json({ error: "You are not signed up yet" });

    const user = existingUser[0];

    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(STATUS.forbidden).json({ error: "Invalid Password" })

    const userData = {
      id: user.id,
      email: user.email
    }

    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" })
    const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET) 

    try{
      await db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [ refreshToken, user.id ]);
    }catch(err){
      return res.sendStatus(STATUS.serverError);
    }

    req.user = user;
    res.cookie("jwt", refreshToken, { httpOnly: true, maxAge:14*24*60*60, secure: true, sameSite: "None" })
    res.status(STATUS.ok).json({ msg: "Login Successful", accessToken:accessToken, refreshToken:refreshToken });


  }catch(err){

    return res.sendStatus(STATUS.serverError)

  }

}

export default checkUser