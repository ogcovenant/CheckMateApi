import express from "express"
import { createSubtaskTask } from "../controllers/subtask/subtaskControllers.js"


export const router = express.Router()

router.route("/add")
  .post(createSubtaskTask)

export default router