import db from "../../config/dbconfig.js";
import STATUS from "../../config/statusConfig.js"


export const getTodayTask = async(req, res) => {
  
  const user = req.user;
  const date = new Date().toLocaleDateString()

  try{  

    const [ tasks ] = await db.query("SELECT * FROM tasks WHERE user_id = ? AND due_date = ?", [ user.id, date ]);
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

    const [ tasks ] = await db.query("SELECT * FROM tasks WHERE user_id = ? AND due_date = ?", [ user.id, tomorrowDate ]);
    if(!tasks[0]) return res.status(STATUS.notFound).json({ error: "Task List Is Empty" });

    res.status(STATUS.ok).json({ msg: "Tasks Retrieved Successfully", tasks: tasks })

  }catch(err){
    console.log(err)
    return res.sendStatus(STATUS.serverError);
  }
  
}