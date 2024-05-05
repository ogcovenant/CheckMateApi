import express from "express"
import { createList } from "../controllers/listControllers"
import { getList } from "../controllers/listControllers"
import { deleteList } from "../controllers/listControllers"
import { updateList } from "../controllers/listControllers"
import { getListTasks } from "../controllers/listControllers"

export const router = express.Router()

router.route("/add")
  .post(createList)

router.route("/")
  .get(getList)
  
router.route("/:id")
  .patch(updateList)

router.route("/:id")
  .delete(deleteList)

router.route("/:id/tasks")
  .get(getListTasks)


export default router