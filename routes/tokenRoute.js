import express from "express"
import refreshTokenHandler from "../controllers/token/refreshTokenHandler.js"

export const router = express.Router()

router.route("/refresh")
  .get(refreshTokenHandler)

export default router