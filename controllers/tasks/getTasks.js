import db from "../../config/dbconfig.js";
import STATUS from "../../config/statusConfig.js"
import { getWeekAndDays } from "../../utils/getWeekAndDays.js";


export const getTodayTask = async(req, res) => {
  
  const user = req.user;
  const date = new Date().toLocaleDateString()

  try{  

    const [ tasks ] = await db.query("SELECT tasks.*, (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', subtasks.id,'title', subtasks.title,'status', subtasks.status)) FROM subtasks WHERE subtasks.task_id = tasks.id ) AS subtasks FROM tasks WHERE user_id = ? AND due_date = ?;", [ user.id, date ]);
    if(!tasks[0]) return res.status(STATUS.notFound).json({ error: "Task List Is Empty" });

    res.status(STATUS.ok).json({ msg: "Tasks Retrieved Successfully", tasks: tasks })

  }catch(err){
    console.log(err)
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