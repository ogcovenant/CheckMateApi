import express from "express"
import { createList } from "../controllers/lists/listControllers.js"

export const router = express.Router()

router.route("/add")
  .post(createList)

export default router