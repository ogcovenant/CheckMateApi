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
    return res.status(STATUS.notAcceptable).json({ msg: "Invalid values provided" });
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

  //an array to store the data been saved into the database
  const userData = [
    id,
    email,
    hashedPassword
  ]

  //inserting the user into the database
  try{  
    //query to insert the user into the database
    await db.query("INSERT INTO users ( id, email, password ) VALUES ( ?, ?, ? )", userData);
  }catch(err){
    //returning an error if there is any issue with the operation
    return res.sendStatus(STATUS.serverError);
  }

  //sending the access token with a success message
  res.status(STATUS.ok).json({ msg: "Account Created Successfully", accessToken:accessToken });
}




//a controller function to login the user
export const loginUser = async(req, res) => {
  
    //validating the request body using express validator 
    const errors = validationResult(req);

    //sending an error if the values provided were invalid
    if(!errors.isEmpty()){
      return res.status(STATUS.notAcceptable).json({ msg: "Invalid values provided" });
    }
  
    //getting the request body and storing them
    const email = req.body.email;
    const password = req.body.password;

    //searching the database to see if the user with the above email exists
    try{

      //creating an array to store the email for security pupose
      const userEmail = [ email ]

      //query to search the database
      const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", userEmail);

      //sending a 404 status if the user was not found
      if(!existingUser[0]) return res.status(STATUS.notFound).json({ error: "You are not signed up yet" });

      //setting storing the user if found
      const user = existingUser[0];

      //matching the password to see if the passwords match
      const match = await bcrypt.compare(password, user.password);

      //sending a not authorized status if the passwords do not match
      if(!match) return res.status(STATUS.unauthorized).json({ error: "Invalid Password" })

      //storind the data required for jwt creation in an object
      const userData = {
        id: user.id,
        email: user.email
      }

      //generating an access token
      const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" })

      //sending the success message along with the access token
      res.status(STATUS.ok).json({ msg: "Login Successful", accessToken:accessToken });


    }catch(err){
      //sending a server error status if any error occurs in the above operation
      return res.sendStatus(STATUS.serverError)
    }
}