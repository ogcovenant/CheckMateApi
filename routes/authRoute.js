import express from "express"
import { createUser } from "../controllers/users/userControllers.js"
import checkUser from "../controllers/users/checkUser.js"
import { body } from "express-validator"

export const router = express.Router()

router.route("/signup", [
  [
    body("email").isEmail().notEmpty(),
    body("password").notEmpty()
  ]
])
  .post(createUser)

router.route("/login")
  .post(checkUser)

export default router