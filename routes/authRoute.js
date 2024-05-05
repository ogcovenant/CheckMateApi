import express from "express"
import { createUser,loginUser } from "../controllers/users/userControllers.js"
import { body } from "express-validator"

export const router = express.Router()

router.route("/signup", [
  [
    body("email").notEmpty().isEmail(),
    body("password").notEmpty()
  ]
])
  .post(createUser)

router.route("/login", [
  [
    body("email").notEmpty().isEmail(),
    body("password").notEmpty()
  ]
])
  .post(loginUser)

export default router