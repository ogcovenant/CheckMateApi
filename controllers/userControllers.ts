//route imports
import bcrypt from "bcryptjs"
import STATUS from "../config/statusConfig"
import db from "../config/dbconfig"
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
    //query to get the existing user
    const existingUser = await db.user.findUnique({
      where: {
        email: email
      }
    });

    //returning a confilict status if there is a user existing with the email
    if(existingUser) return res.status(STATUS.conflict).json({ error: "User with email already exists" });

  }catch(err){
    console.log(err)
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
  const userData = {
    id: id,
    email: email,
    password: hashedPassword
  }

  //inserting the user into the database
  try{  
    //query to insert the user into the database
    await db.user.create({
      data:{
        id: userData.id,
        email: userData.email,
        password: userData.password
      }
    })
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
      //query to search the database
      const existingUser = await db.user.findUnique({
        where:{
          email: email
        }
      })

      //sending a 404 status if the user was not found
      if(!existingUser) return res.status(STATUS.notFound).json({ error: "You are not signed up yet" });

      //matching the password to see if the passwords match
      const match = await bcrypt.compare(password, existingUser.password);

      //sending a not authorized status if the passwords do not match
      if(!match) return res.status(STATUS.unauthorized).json({ error: "Invalid Password" })

      //storind the data required for jwt creation in an object
      const userData = {
        id: existingUser.id,
        email: existingUser.email
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




//a controller to handle forgotten password request
export const forgottenPassword = async(req, res) => {
  //validating the request body using express validator 
  const errors = validationResult(req);

  //sending an error if the values provided were invalid
  if(!errors.isEmpty()){
    return res.status(STATUS.notAcceptable).json({ msg: "Invalid email provided" });
  }

  const email = req.body.email;

  //searching the database to see if the user with the above email exists
  try{
    //query to search the database
    const existingUser = await db.user.findUnique({
      where:{
        email: email
      }
    })

    //sending a 404 status if the user was not found
    if(!existingUser) return res.status(STATUS.notFound).json({ error: "You are not signed up yet" });

    const resetPassId = nanoid();
    
    //usePlunk email configuration for email sending
    const options = {
      method: 'POST',
      headers: JSON.stringify({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PLUNK_API_KEY}`
      }),
      body: JSON.stringify({
        "to":[email],
        "subject":"Reset Password",
        "body":"<string>",
        "name":"CheckMate",
        "from":"justcovenant@gmail.com"
      })
    };
    
    fetch('https://api.useplunk.com/v1/send', options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));

    //sending the success message along with the access token
    res.status(STATUS.ok).json({ msg: "Reset code sent" });


  }catch(err){
    //sending a server error status if any error occurs in the above operation
    return res.sendStatus(STATUS.serverError)
  }
}