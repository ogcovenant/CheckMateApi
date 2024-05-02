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

export const getList = ( req, res ) => {
  
}