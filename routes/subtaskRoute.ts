import express from "express"
import { createSubtaskTask } from "../controllers/subtaskControllers"
import { deleteSubtask } from "../controllers/subtaskControllers"
import { updateSubtask } from "../controllers/subtaskControllers"


export const router = express.Router()

router.route("/add")
  .post(createSubtaskTask)

router.route("/:id")
  .delete(deleteSubtask)
  .patch(updateSubtask)

export default router