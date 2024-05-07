//route imports
import bcrypt from "bcryptjs"
import STATUS from "../config/statusConfig"
import db from "../config/dbconfig"
import { nanoid } from "nanoid";
import jwt from 'jsonwebtoken';
import { validationResult } from "express-validator";
import nodemailer from "nodemailer"
import moment from "moment"



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
      data: userData
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
      console.log(err)
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


    //constructing the expiry date
    const date = new Date();
    const expiry = moment(moment(date).add(3, "hours"))
    const expiryDate = expiry.toDate()

    //create a reset for the current reset 
    const reset = {
      id: nanoid(),
      expiresIn: expiryDate,
      userId: existingUser.id
    }

    //pushing the reset date to the database
    await db.resetPasswordTable.create({
      data: reset
    })
    
    //getting the resetID
    const resetId = await db.resetPasswordTable.findUnique({
      where:{
        userId: reset.userId
      }
    })

   const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "justcovenant@gmail.com",
      pass: "escz neom labs ronu"
    },
   })

   try {
    await transporter.sendMail({
      from: '"CheckMate" <justcovenant@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      html: `<div style="display: flex; flex-direction: column; align-items: center; margin-top: 20px; font-family: Arial"><div style="max-width: 600px; margin: 40px auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px;"><h2 style="color: #333; font-weight: bold; margin-bottom: 20px;">Reset your password</h2><p>Dear User,</p><p style="font-size: 16px; margin-bottom: 30px;">We received a request to reset your password. Click the link below to create a new password and regain access to your account.</p><a href="https://checkmate-x.vercel.app/reset-password/${resetId?.id}" style="background-color: #ffcc24; color: #000; font-style: bold; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none;">Verify Email Address</a><div style="margin-top: 20px">Please note that this link is only valid for 2 hours. If you did not request a password reset, please ignore this email.</div><div><p>Best regards,<br />CheckMate</></div></div></div>`, // html body
      // Add these settings to help prevent spam flags
      sender: '"CheckMate" <justcovenant@gmail.com>', // sender address
      replyTo: '"CheckMate" <justcovenant@gmail.com>', // reply address
      priority: 'high', // email priority
      headers: {
        'Precedence': 'bulk', // email precedence
        'X-Priority': '3', // email priority (3 is high)
      },
    });
   } catch (error) {
    return res.sendStatus(STATUS.serverError);
   }

    //sending the success message along with the access token
    res.status(STATUS.ok).json({ msg: "Reset code sent" });


  }catch(err){
    //sending a server error status if any error occurs in the above operation
    return res.sendStatus(STATUS.serverError)
  }
}



//a controller to reset the user's password
export const resetPassword = async( req, res ) => {
    
  //validating the request body using express validator 
  const errors = validationResult(req);

  //sending an error if the values provided were invalid
  if(!errors.isEmpty()){
    return res.status(STATUS.notAcceptable).json({ msg: "Invalid values provided" });
  }

  //getting the new password
  const resetID = req.body.id
  const password = req.body.password

  //checking the database to see if the resetID is valid
  try{
    const resetData = await db.resetPasswordTable.findUnique({
      where: {
        id: resetID
      }
    })

    //if the resetID is not valid or expired, then we send an error
    if(!resetData || resetData.expiresIn < new Date()){
      return res.status(STATUS.unauthorized).json({ msg: "Invalid reset code" });
    }

    //updating the user's password
    await db.user.update({
      where: {
        id: resetData.userId
      },
      data: {
        password: await bcrypt.hash(password, 12)
      }
    })

    //deleting the reset data from the database
    await db.resetPasswordTable.delete({
      where: {
        id: resetID
      }
    })

    res.status(STATUS.ok).json({ msg: "Password changed successfully" })


  }catch(err){
    //returning a server error status if any issue occurs with the operation
    res.sendStatus(STATUS.serverError)
  }

}