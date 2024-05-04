//route imports
import db from "../../config/dbconfig.js";
import STATUS from "../../config/statusConfig.js"
import Joi from "joi";
import { nanoid } from "nanoid";
import { getWeekAndDays } from "../../utils/getWeekAndDays.js";

//schema for validation 
const taskSchema = Joi.object({
  title : Joi.string(),
  due_date: Joi.string(),
})



//a controller function to create a task
export const createTask = async(req, res) => {

  //getting the request body
  const requestBody = req.body;

  //creating a task object with the values of the new task to be created
  const task = {
    id: nanoid(),
    title: requestBody.title,
    due_date: requestBody.due_date,
    no_of_subtasks: 0,
    list_id: requestBody.list_id || "",
    user_id: req.user.id,
    status: "pending"
  }

  //performing validation
  const titleRaw = taskSchema.validate({ title: task.title });
  const dueDateRaw = taskSchema.validate({ due_date: task.due_date });

  if( titleRaw.error || dueDateRaw.error ){
    return res.status(STATUS.notAcceptable).json({ error: "Invalid Values Provided" });
  }

  //check if specified list is available
  if(task.list_id !== ""){
    try{
    
      const [list] = await db.query("SELECT * FROM lists WHERE id = ?", [ task.list_id ]);
      if(!list[0]) return res.status(STATUS.notFound).json({ error: "Selected List Does Not Exist" });
  
    }catch(err){
      return res.sendStatus(STATUS.serverError);
    }
  }

  //inserting the task into the database
  try{

    //creating a list of arrays to hold the data that is to be stored into the database
    const taskData = [ 
      task.id,
      task.title,
      task.due_date,
      task.no_of_subtasks,
      task.list_id,
      task.user_id,
      task.status
    ]

    //query to insert the data into the database
    await db.query("INSERT INTO tasks ( id, title, due_date, no_of_subtasks, list_id, user_id, status )  VALUES ( ?, ?, ?, ?, ?, ?, ? )", taskData)
  }catch(err){
    console.log(err)
    //returning a server error status if an issue occurs with the operation
    return res.sendStatus(STATUS.serverError);
  }

  //returning an ok response upon successful creation of task
  res.status(STATUS.ok).json({ msg: "Task Created Successfully" })

}



//a controller function to get the task for today
export const getTodayTask = async(req, res) => {
  
  //getting the current user and current date
  const user = req.user;
  const date = new Date().toLocaleDateString()

  //querying the database to get the tasks and associated subtasks
  try{  

    const taskData = [
      user.id,
      date
    ]
    //query to get the tasks
    const [ tasks ] = await db.query("SELECT tasks.*, (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', subtasks.id,'title', subtasks.title,'status', subtasks.status)) FROM subtasks WHERE subtasks.task_id = tasks.id ) AS subtasks FROM tasks WHERE user_id = ? AND due_date = ?;", taskData);
    
    //checking if the task list is not empty
    //sending a not found error if the task list is empty
    if(!tasks[0]) return res.status(STATUS.notFound).json({ error: "Task List Is Empty" });

    //sending a success message and the tasks if the task was retrieved successfully
    res.status(STATUS.ok).json({ msg: "Tasks Retrieved Successfully", tasks: tasks })

  }catch(err){
    //sending a server error status if any error occurs during the operation
    return res.sendStatus(STATUS.serverError);
  }

}

export const getTomorrowTask = async(req, res) => {

  const user = req.user;
  const date = new Date();
  date.setDate(date.getDate() + 1);

  const tomorrowDate = date.toLocaleDateString()

  try{  

    const [ tasks ] = await db.query("SELECT tasks.*, (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', subtasks.id,'title', subtasks.title,'status', subtasks.status)) FROM subtasks WHERE subtasks.task_id = tasks.id ) AS subtasks FROM tasks WHERE user_id = ? AND due_date = ?;", [ user.id, tomorrowDate ]);
    if(!tasks[0]) return res.status(STATUS.notFound).json({ error: "Task List Is Empty" });

    res.status(STATUS.ok).json({ msg: "Tasks Retrieved Successfully", tasks: tasks })

  }catch(err){
    console.log(err)
    return res.sendStatus(STATUS.serverError);
  }
  
}

export const getThisWeekTask = async(req, res) => {

  const user = req.user;
  const date = new Date();  

  const weekDays = getWeekAndDays(date);

  try{  
    const [ tasks ] = await db.query("SELECT tasks.*, (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', subtasks.id,'title', subtasks.title,'status', subtasks.status)) FROM subtasks WHERE subtasks.task_id = tasks.id ) AS subtasks FROM tasks WHERE user_id = ? AND due_date IN (?);", [ user.id, weekDays ]);
    if(!tasks[0]) return res.status(STATUS.notFound).json({ error: "Task List Is Empty" });

    res.status(STATUS.ok).json({ msg: "Tasks Retrieved Successfully", tasks: tasks })
  }catch(err){
    console.log(err)
    return res.sendStatus(STATUS.serverError);
  }

}