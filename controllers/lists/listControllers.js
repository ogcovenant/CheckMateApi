import { nanoid } from "nanoid"
import db from "../../config/dbconfig.js"
import Joi from "joi"
import STATUS from "../../config/statusConfig.js"

const listSchema = Joi.object({
  title: Joi.string(),
  color: Joi.string()
})

export const createList = async( req, res ) => {

  const requestBody = req.body;

  const list = {
    id: nanoid(),
    title: requestBody.title,
    color: requestBody.color,
    user_id: req.user.id
  }

  const titleRaw = listSchema.validate({ title: list.title })
  const color = listSchema.validate({ color: list.color });

  if( titleRaw.error || color.error ){
    return res.status(STATUS.bad).json({ error: "Invalid Values Provided" });
  }

  try{
    await db.query("INSERT INTO lists ( id, title, color, user_id )  VALUES ( ?, ?, ?, ? )", [ list.id, list.title, list.color, list.user_id ]);
  }catch(err){
    return res.sendStatus(STATUS.serverError);
  }

  res.status(STATUS.ok).json({ msg: "List Created Successfully" })

}

export const getList = async( req, res ) => {
  const user = req.user;

  try{  
    const [ lists ] = await db.query("SELECT * FROM lists WHERE user_id = ?", [ user.id ]);
    if(!lists[0]) return res.status(STATUS.notFound).json({ error: "No Lists Is Available" });

    res.status(STATUS.ok).json({ msg: "Lists Retrieved Successfully", lists: lists })
  }catch(err){
    console.log(err)
    return res.sendStatus(STATUS.serverError);
  }

}

export const deleteList = async( req, res ) => {
  const id = req.params.id;
  
  try{
    await db.query("DELETE FROM lists WHERE id = ?", [ id ]);
    await db.query("UPDATE tasks SET list_id = ? WHERE list_id = ?", [ "", id ])
  }catch(err){
    return res.sendStatus(STATUS.serverError)
  }

  return res.status(STATUS.ok).json({ msg: "List Deleted Successfully" })
}

export const updateList = async(req, res) => {

  const id = req.params.id;

  const requestBody = req.body;
  const list = {
    title: requestBody.title,
    color: requestBody.color
  }

  const titleRaw = listSchema.validate({ title: list.title });
  const colorRaw = listSchema.validate({ color: list.color });

  try{

    const [ existingList ] = await db.query("SELECT * FROM lists WHERE id = ?", [ id ])
    if(!existingList[0]) return res.status(STATUS.notFound).json({ error: "Could Not Find The List To Be Updated" });

    if(titleRaw.error) list.title = existingList[0].title
    if(colorRaw.error) list.color = existingList[0].color

    try{
      await db.query("UPDATE lists SET title = ?, color = ? WHERE id = ?", [ list.title, list.color, id ])
    }catch(err){
      return res.sendStatus(STATUS.serverError)
    }

  }catch(err){
    return res.sendStatus(STATUS.serverError)
  }

  res.status(STATUS.ok).json({ msg: "List updated successfully" })

}

export const getListTasks = async( req, res ) => {
  const id = req.params.id;

  try{
    const [ tasks ] = await db.query("SELECT * FROM tasks WHERE list_id = ?", [ id ]);
    if(!tasks[0]) return res.status(STATUS.notFound).json({ error: "No tasks were found for this list"})

    return res.status(STATUS.ok).json({ msg: "Tasks retrieved successfully", tasks: tasks });

  }catch(err){
    return res.sendStatus(STATUS.serverError)
  }
}