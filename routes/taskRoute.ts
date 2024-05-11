import express from "express"
import { createTask } from "../controllers/taskControllers"
import { getTasks } from "../controllers/taskControllers";
import { editTask } from "../controllers/taskControllers";
import { deleteTask } from "../controllers/taskControllers";
import { body } from "express-validator";

export const router = express.Router()

router.route("/add", [
  [
    body("title").trim().notEmpty(),
    body("dueDate").trim().notEmpty(),
    body("priority").trim().notEmpty(),
    body("tags").isArray(),
  ],
])
  .post(createTask)

router.route("/")
  .get(getTasks)

router.route("/edit/:id", [
  [
    body("title").trim().notEmpty(),
    body("dueDate").trim().notEmpty(),
    body("priority").trim().notEmpty(),
    body("tags").isArray(),
    body("status").trim().notEmpty(),
    body("note").notEmpty()
  ],
])
  .put(editTask)

router.route("/delete/:id")
  .delete(deleteTask)


export default router