import express from "express"
import { createSubtaskTask } from "../controllers/subtask/subtaskControllers.js"
import { deleteSubtask } from "../controllers/subtask/subtaskControllers.js"


export const router = express.Router()

router.route("/add")
  .post(createSubtaskTask)

router.route("/:id")
  .delete(deleteSubtask)

export default router