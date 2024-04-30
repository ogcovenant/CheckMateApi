import bcrypt from "bcryptjs"
import STATUS from "../../config/statusConfig.js"
import Joi from "joi";
import db from "../../config/dbconfig.js"
import { nanoid } from "nanoid";
import jwt from 'jsonwebtoken';

const userSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
})

export const createUser = async ( req, res, next ) => {
  const emailRaw = userSchema.validate({ email: req.body.email });
  const passwordRaw = userSchema.validate({ password: req.body.password });

  if(emailRaw.error|| passwordRaw.error ){
    return res.status(STATUS.bad).json({ msg: "Invalid values provided" });
  }

  const email = emailRaw.value.email;
  const password = passwordRaw.value.password;

  try{

    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if(existingUser[0]) return res.status(STATUS.conflict).json({ error: "User with email already exists" });

  }catch(err){
    return res.sendStatus(STATUS.serverError);
  }

  const id = nanoid();
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = {
    id: id,
    email: email
  }
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" })
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET) 

  try{
    await db.query("INSERT INTO users ( id, email, password, refresh_token ) VALUES ( ?, ?, ?, ? )", [id, email, hashedPassword, refreshToken]);
  }catch(err){
    return res.status(STATUS.serverError).json({ err });
  }

  res.cookie("jwt", refreshToken, { httpOnly: true, maxAge:14*24*60*60 })
  res.status(STATUS.ok).json({ msg: "Account Created Successfully", accessToken:accessToken, refreshToken:refreshToken });
}

export default createUser