import express from "express"
import { createList } from "../controllers/lists/listControllers.js"
import { getList } from "../controllers/lists/listControllers.js"

export const router = express.Router()

router.route("/add")
  .post(createList)

router.route("/")
  .get(getList)

export default router