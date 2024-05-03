import db from "../../config/dbconfig.js";
import STATUS from "../../config/statusConfig.js"
import Joi from "joi";
import { nanoid } from "nanoid";

const subtaskSchema = Joi.object({
  title: Joi.string(),
  task_id: Joi.string()
})

export const createSubtaskTask = async (req, res) => {
  const requestBody = req.body;

  const subtask = {
    id: nanoid(),
    title: requestBody.title,
    status: "pending",
    task_id: requestBody.task_id
  }

  const titleRaw = subtaskSchema.validate({ title: subtask.title });
  const taskIdRaw = subtaskSchema.validate({ title: subtask.task_id });

  if( titleRaw.error || taskIdRaw.error ){
    return res.status(STATUS.bad).json({ error: "Invalid Values Provided" });
  }

  let no_of_subtasks = 0;
  let id = "";

  try{
    
    const [task] = await db.query("SELECT * FROM tasks WHERE id = ?", [ subtask.task_id ]);
    if(!task[0]) return res.status(STATUS.notFound).json({ error: "Selected Task Does Not Exist" });

    no_of_subtasks = task[0].no_of_subtasks;
    id = task[0].id

  }catch(err){
    return res.sendStatus(STATUS.serverError);
  }

  try{
    await db.query("INSERT INTO subtasks ( id, title, task_id, status )  VALUES ( ?, ?, ?, ? )", [ subtask.id, subtask.title, subtask.task_id, subtask.status ])
    await db.query("UPDATE tasks SET no_of_subtasks = ? WHERE id = ?", [ no_of_subtasks+1, id ])
  }catch(err){
    return res.sendStatus(STATUS.serverError);
  }

  res.status(STATUS.ok).json({ msg: "Subtask Added Successfully" })

}