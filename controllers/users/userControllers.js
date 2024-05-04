//route imports
import bcrypt from "bcryptjs"
import STATUS from "../../config/statusConfig.js"
import db from "../../config/dbconfig.js"
import { nanoid } from "nanoid";
import jwt from 'jsonwebtoken';
import { validationResult } from "express-validator";



//a controller function to create user
export const createUser = async ( req, res ) => {
  
  //validating the request body using express validator 
  const errors = validationResult(req);

  //sending an error if the values provided were invalid
  if(!errors.isEmpty()){
    return res.status(STATUS.bad).json({ msg: "Invalid values provided" });
  }

  //getting the request body and storing them
  const email = req.body.email;
  const password = req.body.password;

  //checking if a user is already present with the email
  try{
    //storing the email in an array for security purposes
    const existingEmail = [ email ]

    //query to get the existing user
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", existingEmail);

    //returning a confilict status if there is a user existing with the email
    if(existingUser[0]) return res.status(STATUS.conflict).json({ error: "User with email already exists" });

  }catch(err){
    //returning an error if there is any error with the operation
    return res.sendStatus(STATUS.serverError);
  }

  //creating a dynamic id and hashing the user password
  const id = nanoid();
  const hashedPassword = await bcrypt.hash(password, 12);

  //creating a user object to be encoded into the JWT
  const user = {
    id,
    email
  }
  //creating the access and refresh tokens
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" })
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET) 

  //an array to store the data been saved into the database
  const userData = [
    id,
    email,
    hashedPassword,
    refreshToken
  ]

  //inserting the user into the database
  try{  
    //query to insert the user into the database
    await db.query("INSERT INTO users ( id, email, password, refresh_token ) VALUES ( ?, ?, ?, ? )", userData);
  }catch(err){
    //returning an error if there is any issue with the operation
    return res.sendStatus(STATUS.serverError);
  }

  //setting the refresh token as an http only cookie and sending the access token with a success message
  res.cookie("jwt", refreshToken, { httpOnly: true, maxAge:(14*24*60*60) })
  res.status(STATUS.ok).json({ msg: "Account Created Successfully", accessToken:accessToken });
}