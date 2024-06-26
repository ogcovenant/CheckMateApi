//route imports
import db from "../config/dbconfig";
import STATUS from "../config/statusConfig";
import { nanoid } from "nanoid";
import { validationResult } from "express-validator";



//a controller function to create a task
export const createTask = async (req, res) => {
  //validating the request body using express validator
  const errors = validationResult(req);

  //sending an error if the values provided were invalid
  if (!errors.isEmpty()) {
    return res
      .status(STATUS.notAcceptable)
      .json({ msg: "Invalid values provided" });
  }

  //creating a task object to hold the data to be stored in the database
  const task = {
    id: nanoid(),
    title: req.body.title,
    due_date: req.body.dueDate,
    priority: req.body.priority,
    note: req.body.note,
    user_id: req.user.id,
    status: "pending",
  };

  //checking if the values recieved are not empty
  if (
    !task.id ||
    !task.title ||
    !task.due_date ||
    !task.priority ||
    !task.note
  ) {
    return res
      .status(STATUS.notAcceptable)
      .json({ msg: "Invalid values provided" });
  }

  //inserting the task into the database
  try {
    //query to insert
    await db.task.create({
      data: {
        id: task.id,
        title: task.title,
        dueDate: task.due_date,
        priority: task.priority,
        userId: task.user_id,
        status: task.status,
        note: task.note
      },
    });
  } catch (err) {
    console.log(err);
    //returning a server error status if an issue occurs with the operation
    return res.sendStatus(STATUS.serverError);
  }

  //saving a notification
  try {
    await db.notifications.create({
      data: {
        id: nanoid(),
        title: "Task Created Successfully",
        description: `You just created a new task: ${task.title}`,
        type: "creation",
        userId: task.user_id,
      },
    });
  } catch (err) {
    console.log(err);
    //returning a server error status if an issue occurs with the operation
    return res.sendStatus(STATUS.serverError);
  }

  //returning an ok response upon successful creation of task
  res.status(STATUS.created).json({ msg: "Task Created Successfully" });
};



//a controller method to get the list of tasks belonging to a single user 
export const getTasks = async (req, res) => {
  //getting the user making the request
  const userId = req.user.id;

  try {
    //query to get the tasks from the backend
    const tasks = await db.task.findMany({
      where: {
        userId: userId,
      }
    });

    if (!tasks)
      return res
        .status(STATUS.notFound)
        .json({ error: "You don't have any task" });

    res
      .status(STATUS.ok)
      .json({ msg: "Task Fetched Successfully", tasks: tasks });
  } catch (err) {
    //returning a server error status if an issue occurs with the operation
    return res.sendStatus(STATUS.serverError);
  }
};



//a controller method to update the task whose id was specified
export const editTask = async (req, res) => {
  const taskId = req.params.id;

  //validating the request body using express validator
  const errors = validationResult(req);

  //sending an error if the values provided were invalid
  if (!errors.isEmpty()) {
    return res
      .status(STATUS.notAcceptable)
      .json({ msg: "Invalid values provided" });
  }

  //creating a task object to hold the data to be stored in the database
  const task = {
    title: req.body.title,
    due_date: req.body.dueDate,
    priority: req.body.priority,
    status: req.body.status,
    note: req.body.note
  };

  //checking if the values recieved are not empty
  if (
    !task.title ||
    !task.due_date ||
    !task.priority ||
    !task.status ||
    !task.note
  ){
    return res.status(STATUS.notAcceptable).json({ msg: "Invalid values provided" });
  }

  try {
    await db.task.update({
      where:{
        id: taskId
      },
      data: {
        title: task.title,
        dueDate: task.due_date,
        priority: task.priority,
        status: task.status,
        note: task.note
      },
    });

    res.sendStatus(STATUS.ok).json({ msg: "Task updated successfully" })

  } catch (err) {
    console.log(err)
    //sending an error if the task could not be updated
    return res.sendStatus(STATUS.serverError)
  }
};




export const deleteTask = async(req, res) => {
  const taskId = req.params.id;

  try {
    await db.task.delete({
      where:{
        id: taskId,
      }
    })

    // await db.tag.deleteMany({
    //   where:{
    //     taskId: taskId
    //   }
    // })

    res.status(STATUS.noContent).json({ msg: "Task Deleted Successfully" })

  } catch (err) {
    return res.sendStatus(STATUS.serverError)
  }
}