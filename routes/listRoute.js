import express from "express"
import { createList } from "../controllers/lists/listControllers.js"
import { getList } from "../controllers/lists/listControllers.js"
import { deleteList } from "../controllers/lists/listControllers.js"
import { updateList } from "../controllers/lists/listControllers.js"
import { getListTasks } from "../controllers/lists/listControllers.js"

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