import express from "express"
import { createUser, loginUser, forgottenPassword } from "../controllers/userControllers"
import { body } from "express-validator"

export const router = express.Router()

router.route("/signup", [
  [
    body("email").trim().notEmpty().isEmail(),
    body("password").trim().notEmpty()
  ]
])
  .post(createUser)

router.route("/login", [
  [
    body("email").trim().notEmpty().isEmail(),
    body("password").trim().notEmpty()
  ]
])
  .post(loginUser)

router.route("/forgotten-password", [
  [
    body("email").trim().notEmpty().isEmail()
  ]
])
  .post(forgottenPassword)

export default router