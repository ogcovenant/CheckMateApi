"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListTasks = exports.updateList = exports.deleteList = exports.getList = exports.createList = void 0;
//route imports
const nanoid_1 = require("nanoid");
const joi_1 = __importDefault(require("joi"));
const statusConfig_1 = __importDefault(require("../config/statusConfig"));
//created the joi schema for requests validation
const listSchema = joi_1.default.object({
    title: joi_1.default.string(),
    color: joi_1.default.string()
});
//a controller function to create a list
const createList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //getting the request body and assigned it to a constant
    const requestBody = req.body;
    //created a list object and passed the relevant attributes to it
    const list = {
        id: (0, nanoid_1.nanoid)(),
        title: requestBody.title,
        color: requestBody.color,
        user_id: req.user.id
    };
    //validated the title and color attribute from the request body
    const titleRaw = listSchema.validate({ title: list.title });
    const color = listSchema.validate({ color: list.color });
    //checking if there's any error with the title and color attributes
    if (titleRaw.error || color.error) {
        return res.status(statusConfig_1.default.notAcceptable).json({ error: "Invalid Values Provided" });
    }
    //creating a list data array to be passed into the query to insert a new list into the database
    const listData = [
        list.id,
        list.title,
        list.color,
        list.user_id
    ];
    //inserting the list data into the database to create a new list
    try {
        //the database query to insert the list
        // await db.query("INSERT INTO lists ( id, title, color, user_id )  VALUES ( ?, ?, ?, ? )", listData);
    }
    catch (err) {
        //returning a server error status if there's any issue when inserting the list into the database
        return res.sendStatus(statusConfig_1.default.serverError);
    }
    //returning a success message upon successful entry into the database
    res.status(statusConfig_1.default.created).json({ msg: "List Created Successfully" });
});
exports.createList = createList;
//a controller function the get an array containing the list of "lists" created by the user 
const getList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //getting the user id of the current user
    const userID = req.user.id;
    //created an array to store the user's id for security purposes
    const userData = [userID];
    //querying the database to fetch the list of "lists"
    try {
        //the database query to get the list of "lists" 
        // const [ lists ] = await db.query("SELECT * FROM lists WHERE user_id = ?", userData);
        //returning a not found status if no list was found after the query
        // if(!lists[0]) return res.status(STATUS.notFound).json({ error: "No Lists Is Available" });
        //returning a success message and the list of "lists" upon successful query of the database
        // res.status(STATUS.ok).json({ msg: "Lists Retrieved Successfully", lists: lists })
    }
    catch (err) {
        //returning a server error status if there's any issue when getting the list of "lists"
        return res.sendStatus(statusConfig_1.default.serverError);
    }
});
exports.getList = getList;
//a controller function to delete a list
const deleteList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //getting the id of the list to be deleted
    const id = req.params.id;
    //creating an array that stores the id of the list to be deleted for security purposes
    const listID = [id];
    //creating an array to store the parameters of the update task query
    const taskUpdateData = [
        "",
        id
    ];
    //deleting the list and setting the tasks that are assigned to that list an empty list value in the database 
    try {
        //the database query to delete the list
        // await db.query("DELETE FROM lists WHERE id = ?", listID);
        //the databse query to update the tasks associated with the list that has been deleted
        // await db.query("UPDATE tasks SET list_id = ? WHERE list_id = ?", taskUpdateData)
    }
    catch (err) {
        //returning a server error status if there's any issue when performing the database operations
        return res.sendStatus(statusConfig_1.default.serverError);
    }
    //returning a success message upon successful deletion of the list
    return res.status(statusConfig_1.default.noContent).json({ msg: "List Deleted Successfully" });
});
exports.deleteList = deleteList;
//a controller function to update a list
const updateList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //getting the id of the list to be updated
    const id = req.params.id;
    //getting the request body that contains the data the list should be updated to
    const requestBody = req.body;
    //creating a list object to store the data to be updated
    const list = {
        title: requestBody.title,
        color: requestBody.color
    };
    //validating the parameters to check which of the parameters should be updated
    const titleRaw = listSchema.validate({ title: list.title });
    const colorRaw = listSchema.validate({ color: list.color });
    //checking if the list is present in the database and updating it if it exists
    try {
        //creating an array to store the listId for security reasons
        const listID = [id];
        //query to check if the list exists
        // const [ existingList ] = await db.query("SELECT * FROM lists WHERE id = ?", listID)
        //return a not found status code if the list is not found
        // if(!existingList[0]) return res.status(STATUS.notFound).json({ error: "Could Not Find The List To Be Updated" });
        //setting either of the parameters to the default params if they are not to be updated
        // if(titleRaw.error) list.title = existingList[0].title
        // if(colorRaw.error) list.color = existingList[0].color
        //updating the list in the database
        try {
            //creating an array to store the updated parameters
            const listData = [
                list.title,
                list.color,
                id
            ];
            //query to update the list
            // await db.query("UPDATE lists SET title = ?, color = ? WHERE id = ?", listData)
        }
        catch (err) {
            //returning a server error status if there was an error when updating the database
            return res.sendStatus(statusConfig_1.default.serverError);
        }
    }
    catch (err) {
        //returning a server error status if there was an error in any of the database operations
        return res.sendStatus(statusConfig_1.default.serverError);
    }
    //returning a success status message upon successful list update 
    res.status(statusConfig_1.default.noContent).json({ msg: "List updated successfully" });
});
exports.updateList = updateList;
//a controller to get the list of tasks associated with the list
const getListTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //getting the list's id
    const id = req.params.id;
    //getting the tasks associated with the list from the database
    try {
        //creating an array to store the id of the list for security purposes
        const listId = [id];
        //query to get the tasks from the database
        // const [ tasks ] = await db.query("SELECT tasks.*, (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', subtasks.id,'title', subtasks.title,'status', subtasks.status)) FROM subtasks WHERE subtasks.task_id = tasks.id ) AS subtasks FROM tasks WHERE list_id = ?", listId);
        //returning a not found status if there is no task attached to the list 
        // if(!tasks[0]) return res.status(STATUS.notFound).json({ error: "No tasks were found for this list"})
        //returning a success status message upon successful retrieval of the tasks 
        // return res.status(STATUS.ok).json({ msg: "Tasks retrieved successfully", tasks: tasks });
    }
    catch (err) {
        //returning a server error status if there was an error while performing the database operation
        return res.sendStatus(statusConfig_1.default.serverError);
    }
});
exports.getListTasks = getListTasks;
