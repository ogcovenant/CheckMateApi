import express from "express"
import { createTask } from "../controllers/tasks/taskControllers.js"
import { getTodayTask } from "../controllers/tasks/taskControllers.js"
import { getTomorrowTask } from "../controllers/tasks/taskControllers.js"
import { getThisWeekTask } from "../controllers/tasks/taskControllers.js"

export const router = express.Router()

router.route("/add")
  .post(createTask)

router.route("/today")
  .get(getTodayTask)

router.route("/tomorrow")
  .get(getTomorrowTask)

router.route("/thisweek")
  .get(getThisWeekTask)

export default router