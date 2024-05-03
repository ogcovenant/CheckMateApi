//route imports
import { nanoid } from "nanoid"
import db from "../../config/dbconfig.js"
import Joi from "joi"
import STATUS from "../../config/statusConfig.js"

//created the joi schema for requests validation
const listSchema = Joi.object({
  title: Joi.string(),
  color: Joi.string()
})


//a controller function to create a list
export const createList = async( req, res ) => {

  //getting the request body and assigned it to a constant
  const requestBody = req.body;

  //created a list object and passed the relevant attributes to it
  const list = {
    id: nanoid(),
    title: requestBody.title,
    color: requestBody.color,
    user_id: req.user.id
  }

  //validated the title and color attribute from the request body
  const titleRaw = listSchema.validate({ title: list.title })
  const color = listSchema.validate({ color: list.color });

  //checking if there's any error with the title and color attributes
  if( titleRaw.error || color.error ){
    return res.status(STATUS.bad).json({ error: "Invalid Values Provided" });
  }

  //creating a list data array to be passed into the query to insert a new list into the database
  const listData = [
    list.id,
    list.title,
    list.color,
    list.user_id
  ];

  //inserting the list data into the database to create a new list
  try{
    //the database query to insert the list
    await db.query("INSERT INTO lists ( id, title, color, user_id )  VALUES ( ?, ?, ?, ? )", listData);
  }catch(err){
    //returning a server error status if there's any issue when inserting the list into the database
    return res.sendStatus(STATUS.serverError);
  }

  //returning a success message upon successful entry into the database
  res.status(STATUS.ok).json({ msg: "List Created Successfully" })
}



//a controller function the get an array containing the list of "lists" created by the user 
export const getList = async( req, res ) => {

  //getting the user id of the current user
  const userID = req.user.id;

  //created an array to store the user's id for security purposes
  const userData = [ userID ]

  //querying the database to fetch the list of "lists"
  try{  
    //the database query to get the list of "lists" 
    const [ lists ] = await db.query("SELECT * FROM lists WHERE user_id = ?", userData);

    //returning a not found status if no list was found after the query
    if(!lists[0]) return res.status(STATUS.notFound).json({ error: "No Lists Is Available" });

    //returning a success message and the list of "lists" upon successful query of the database
    res.status(STATUS.ok).json({ msg: "Lists Retrieved Successfully", lists: lists })
  }catch(err){
    //returning a server error status if there's any issue when getting the list of "lists"
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