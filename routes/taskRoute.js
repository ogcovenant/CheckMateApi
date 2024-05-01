import express from "express"
import createTask from "../controllers/tasks/createTask.js"

export const router = express.Router()

router.route("/tasks")
  .post(createTask)

export default router