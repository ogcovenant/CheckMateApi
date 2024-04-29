import express from "express"
import createUser from "../controllers/users/createUser.js"

export const router = express.Router()

router.route("/signup")
  .post(createUser)

export default router