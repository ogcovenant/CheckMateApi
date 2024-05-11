//route imports
import db from "../config/dbconfig";
import STATUS from "../config/statusConfig"
import { nanoid } from "nanoid";
import { validationResult } from "express-validator";

//a controller function to create a task
export const createTask = async(req, res) => {

   //validating the request body using express validator 
   const errors = validationResult(req);

   //sending an error if the values provided were invalid
   if(!errors.isEmpty()){
     return res.status(STATUS.notAcceptable).json({ msg: "Invalid values provided" });
   }

  //creating a task object to hold the data to be stored in the database
   const task = {
    id: nanoid(),
    title: req.body.title,
    due_date: req.body.dueDate,
    priority: req.body.priority,
    tags: req.body.tags,
    category: req.body.category,
    no_of_subtasks: 0,
    user_id: req.user.id,
    status: "pending"
   }

   //checking if the values recieved are not empty
   if (!task.id ||
       !task.title ||
       !task.due_date ||
       !task.priority ||
       !task.tags ||
       !task.category ){
    return res.status(STATUS.notAcceptable).json({ msg: "Invalid values provided" });
   }


  //inserting the task into the database
  try{
    
    //query to insert
    await db.task.create({
      data:{
        id: task.id,
        title: task.title,
        dueDate: task.due_date,
        priority: task.priority,
        userId: task.user_id,
        noOfSubtasks: task.no_of_subtasks,
        status: task.status
      }
    })
    
    //inserting tags
    const tags = task.tags;

    tags.forEach(async(tag) => {
      await db.tag.create({
        data: {
          id: nanoid(),
          title: tag,
          taskId: task.id
        }
      })
    });

    //inserting category
    await db.category.create({
      data: {
        id: nanoid(),
        title: task.category,
        taskId: task.id
      }
    })

  }catch(err){
    console.log(err)
    //returning a server error status if an issue occurs with the operation
    return res.sendStatus(STATUS.serverError);
  }

  //saving a notification
  try{
    await db.notifications.create({
      data:{
        id: nanoid(),
        title: "Task Created Successfully",
        description: `You just created a new task: ${task.title}`,
        type: "creation",
        userId: task.user_id
      }
    })
  }catch(err){
    //returning a server error status if an issue occurs with the operation
    return res.sendStatus(STATUS.serverError);
  }

  //returning an ok response upon successful creation of task
  res.status(STATUS.ok).json({ msg: "Task Created Successfully" })

}



export const getTasks = async(req, res) => {

  //getting the user making the request
  const userId = req.user.id;

  try{
    //query to get the tasks from the backend
    const tasks = await db.task.findMany({
      where:{
        userId: userId
      },
      include:{
        tags: {
          select:{
            id: true,
            title: true
          }
        },
        category: {
          select:{
            id: true,
            title: true
          }
        }
      }
    })

    if( !tasks ) return res.status(STATUS.notFound).json({ error: "You don't have any task" })

    res.status(STATUS.ok).json({ msg: "Task Fetched Successfully", tasks: tasks })

  }catch(err){
   //returning a server error status if an issue occurs with the operation
   return res.sendStatus(STATUS.serverError);
  }

}