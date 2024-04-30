import express from "express"
import createUser from "../controllers/users/createUser.js"
import checkUser from "../controllers/users/checkUser.js"
import refreshTokenHandler from "../controllers/token/refreshTokenHandler.js"

export const router = express.Router()

router.route("/signup")
  .post(createUser)

router.route("/login")
  .post(checkUser)

export default router