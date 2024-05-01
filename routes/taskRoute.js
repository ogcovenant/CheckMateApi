import express from "express"
import createTask from "../controllers/tasks/createTask.js"
import { getTodayTask } from "../controllers/tasks/getTasks.js"

export const router = express.Router()

router.route("/add")
  .post(createTask)

router.route("/today")
  .get(getTodayTask)

export default router