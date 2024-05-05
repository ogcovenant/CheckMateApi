import express from "express"
import { createTask } from "../controllers/taskControllers"
import { getTodayTask } from "../controllers/taskControllers"
import { getTomorrowTask } from "../controllers/taskControllers"
import { getThisWeekTask } from "../controllers/taskControllers"

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