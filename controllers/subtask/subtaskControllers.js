//route imports
import db from "../../config/dbconfig.js";
import STATUS from "../../config/statusConfig.js"
import Joi from "joi";
import { nanoid } from "nanoid";


//created the the subtask Joi Schema for validation later on
const subtaskSchema = Joi.object({
  title: Joi.string(),
  task_id: Joi.string()
})



//a controller function to create a subtask
export const createSubtaskTask = async (req, res) => {
  //creating a constant to store the request body
  const requestBody = req.body;

  //creating a subtask object to be inserted into the database
  const subtask = {
    id: nanoid(),
    title: requestBody.title,
    status: "pending",
    task_id: requestBody.task_id
  }

  //validating the parameters gotten from the request body
  const titleRaw = subtaskSchema.validate({ title: subtask.title });
  const taskIdRaw = subtaskSchema.validate({ title: subtask.task_id });

  //returning a not acceptable status if the request bodies does not meet the validation requirements
  if( titleRaw.error || taskIdRaw.error ){
    return res.status(STATUS.notAcceptable).json({ error: "Invalid Values Provided" });
  }

  //created a temporary storage to store the no of subtasks and task_id 
  let no_of_subtasks = 0;
  let id = "";

  //verifying the task_id provided against the list of tasks in the database
  try{
    //created an array to store the subtask.task_id
    const subtaskTaskID = [ subtask.task_id ]

    //query to get the task matching the task_id in the database
    const [task] = await db.query("SELECT * FROM tasks WHERE id = ?", subtaskTaskID);

    //returning a not found status if the task is not found in the database 
    if(!task[0]) return res.status(STATUS.notFound).json({ error: "Selected Task Does Not Exist" });

    //updating the temporary storage to store the id and no of subtasks of the task after its verification 
    no_of_subtasks = task[0].no_of_subtasks;
    id = task[0].id

  }catch(err){
    //returning a server error status if any error occures during the database operation
    return res.sendStatus(STATUS.serverError);
  }

  //inserting the new subtask into the database and updating the no of subtasks in the parent task
  try{
    //creating an array to store the subtask data to be inserted
    const subtaskData = 
      [subtask.id,
      subtask.title,
      subtask.task_id,
      subtask.status
    ]

    //query to insert the subtask into the database
    await db.query("INSERT INTO subtasks ( id, title, task_id, status )  VALUES ( ?, ?, ?, ? )", subtaskData)

    //creating an array to store the updated task parameter and id
    const taskData = [ 
      no_of_subtasks + 1,
      id
    ]

    //query to update the task parameters in the database
    await db.query("UPDATE tasks SET no_of_subtasks = ? WHERE id = ?", taskData)
  }catch(err){
    //returning a server error status if an error occurs
    return res.sendStatus(STATUS.serverError);
  }

  //returning a success message upon successful creation of the subtask
  res.status(STATUS.ok).json({ msg: "Subtask Added Successfully" })
}