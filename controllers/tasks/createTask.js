import db from "../../config/dbconfig.js";
import STATUS from "../../config/statusConfig.js"
import Joi from "joi";
import { nanoid } from "nanoid";

const taskSchema = Joi.object({
  title : Joi.string(),
  due_date: Joi.string(),
  list_id: Joi.string()
})


export const createTask = async(req, res) => {

  const requestBody = req.body;

  const task = {
    id: nanoid(),
    title: requestBody.title,
    due_date: requestBody.due_date,
    no_of_subtasks: 0,
    list_id: requestBody.list_id,
    user_id: req.user.id
  }

  const titleRaw = taskSchema.validate({ title: task.title });
  const dueDateRaw = taskSchema.validate({ due_date: task.due_date });
  const listIdRaw = taskSchema.validate({ list_id: task.list_id });

  if( titleRaw.error || dueDateRaw.error || listIdRaw.error ){
    return res.status(STATUS.bad).json({ error: "Invalid Values Provided" });
  }

  try{
    
    const [list] = await db.query("SELECT * FROM lists WHERE id = ?", [ task.list_id ]);
    if(!list[0]) return res.status(STATUS.notFound).json({ error: "Selected List Does Not Exist" });

  }catch(err){
    return res.sendStatus(STATUS.serverError);
  }

  try{
    await db.query("INSERT INTO tasks ( id, title, due_date, no_of_subtasks, list_id, user_id )  VALUES ( ?, ?, ?, ?, ?, ? )", [ task.id, task.title, task.due_date, task.no_of_subtasks, task.list_id, task.user_id ])
  }catch(err){
    return res.sendStatus(STATUS.serverError);
  }

  res.status(STATUS.ok).json({ msg: "Task Created Successfully" })

}

export default createTask;