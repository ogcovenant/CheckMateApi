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
exports.updateSubtask = exports.deleteSubtask = exports.createSubtaskTask = void 0;
const statusConfig_1 = __importDefault(require("../config/statusConfig"));
const joi_1 = __importDefault(require("joi"));
const nanoid_1 = require("nanoid");
//created the the subtask Joi Schema for validation later on
const subtaskSchema = joi_1.default.object({
    title: joi_1.default.string(),
    status: joi_1.default.string(),
    task_id: joi_1.default.string()
});
//a controller function to create a subtask
const createSubtaskTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //creating a constant to store the request body
    const requestBody = req.body;
    //creating a subtask object to be inserted into the database
    const subtask = {
        id: (0, nanoid_1.nanoid)(),
        title: requestBody.title,
        status: "pending",
        task_id: requestBody.task_id
    };
    //validating the parameters gotten from the request body
    const titleRaw = subtaskSchema.validate({ title: subtask.title });
    const taskIdRaw = subtaskSchema.validate({ title: subtask.task_id });
    //returning a not acceptable status if the request bodies does not meet the validation requirements
    if (titleRaw.error || taskIdRaw.error) {
        return res.status(statusConfig_1.default.notAcceptable).json({ error: "Invalid Values Provided" });
    }
    //created a temporary storage to store the no of subtasks and task_id 
    let no_of_subtasks = 0;
    let id = "";
    //verifying the task_id provided against the list of tasks in the database
    try {
        //created an array to store the subtask.task_id
        const subtaskTaskID = [subtask.task_id];
        //query to get the task matching the task_id in the database
        // const [task] = await db.query("SELECT * FROM tasks WHERE id = ?", subtaskTaskID);
        //returning a not found status if the task is not found in the database 
        // if(!task[0]) return res.status(STATUS.notFound).json({ error: "Selected Task Does Not Exist" });
        //updating the temporary storage to store the id and no of subtasks of the task after its verification 
        // no_of_subtasks = task[0].no_of_subtasks;
        // id = task[0].id
    }
    catch (err) {
        //returning a server error status if any error occures during the database operation
        return res.sendStatus(statusConfig_1.default.serverError);
    }
    //inserting the new subtask into the database and updating the no of subtasks in the parent task
    try {
        //creating an array to store the subtask data to be inserted
        const subtaskData = [subtask.id,
            subtask.title,
            subtask.task_id,
            subtask.status
        ];
        //query to insert the subtask into the database
        // await db.query("INSERT INTO subtasks ( id, title, task_id, status )  VALUES ( ?, ?, ?, ? )", subtaskData)
        //creating an array to store the updated task parameter and id
        const taskData = [
            no_of_subtasks + 1,
            id
        ];
        //query to update the task parameters in the database
        // await db.query("UPDATE tasks SET no_of_subtasks = ? WHERE id = ?", taskData)
    }
    catch (err) {
        //returning a server error status if an error occurs
        return res.sendStatus(statusConfig_1.default.serverError);
    }
    //returning a success message upon successful creation of the subtask
    res.status(statusConfig_1.default.ok).json({ msg: "Subtask Added Successfully" });
});
exports.createSubtaskTask = createSubtaskTask;
//a controller function to delete a subtask
const deleteSubtask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //getting the id of the subtask to be deleted
    const subtaskID = req.params.id;
    //create an array to store the id of the subtask for security purposes
    const subtask_id = [subtaskID];
    //created a temporary storage to store the no of subtasks and task_id 
    let no_of_subtasks = 0;
    let task_id = [];
    //deleting the subtask and updating the no_of_subtasks from the related task
    try {
        //search for selected subtask to see if it exists
        // const [ subtask ] = await db.query("SELECT * FROM subtasks WHERE id = ?", subtask_id);
        //if the specified subtask does not exist return a not found error
        // if(!subtask[0]) return res.status(STATUS.notFound).json({ error: "Could not find specified subtask" });
        //assign the task_id from the subtask to the temporary storage
        // task_id = [ subtask[0].task_id ];
        //search the database for the parent task of the subtask
        try {
            //query to get the parent task
            // const [ task ] = await db.query("SELECT * FROM tasks WHERE id = ?", task_id)
            //check if the parent task exists
            // if(!task[0]) return res.status(STATUS.notFound).json({ error: "Could not find the parent task of the specified subtask" });
            //assign the no_of_subtasks to the temporary storage 
            // no_of_subtasks = task[0].no_of_subtasks;
            //delete the subtask and update the parent task no_of_subtasks
            try {
                //query to delete the subtask
                // await db.query("DELETE FROM subtasks WHERE id = ?", subtask_id);
                //create an array to store the params to update
                const taskData = [
                    no_of_subtasks - 1,
                    task_id
                ];
                //query to update tasks
                // await db.query("UPDATE tasks SET no_of_subtasks = ? WHERE id = ?", taskData)
            }
            catch (err) {
                //returning a server error status if any error occurs in the operation
                return res.sendStatus(statusConfig_1.default.serverError);
            }
        }
        catch (err) {
            //returning a server error if there's any issue with the operation
            return res.sendStatus(statusConfig_1.default.serverError);
        }
    }
    catch (err) {
        //returning a server error if there's any issue with the operation
        return res.sendStatus(statusConfig_1.default.serverError);
    }
    res.status(statusConfig_1.default.noContent).json({ msg: "Subtask deleted successfully" });
});
exports.deleteSubtask = deleteSubtask;
//a controller function to update a subtasks
const updateSubtask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //getting the id of the subtask to be deleted
    const subtaskID = [req.params.id];
    //creating an object of subtask to store the data to be updated
    const subtask = {
        title: req.body.title,
        status: req.body.status
    };
    //validating the request body
    const titleRaw = subtaskSchema.validate({ title: subtask.title });
    const statusRaw = subtaskSchema.validate({ status: subtask.status });
    //check if the list to be updated exists and update it if it exists
    try {
        //query to select the specified subtask
        // const [ existingSubtask ] = await db.query("SELECT * FROM subtasks WHERE id = ?", [ subtaskID ])
        //sends a not found status if the task is not found
        // if(!existingSubtask[0]) return res.status(STATUS.notFound).json({ error: "Could not find the specified subtask to be updated" });
        //check if the a title or color is present in the request body and assign a default value if one is not specified
        // if(titleRaw.error) subtask.title = existingSubtask[0].title
        // if(statusRaw.error) subtask.status = existingSubtask[0].status
        //update the subtasks
        try {
            //creating an array to store the subtask data
            const subtaskData = [
                subtask.title,
                subtask.status,
                subtaskID[0]
            ];
            //query to update the subtask
            // await db.query("UPDATE subtasks SET title = ?, status = ? WHERE id = ?", subtaskData)
        }
        catch (err) {
            //returning a server error if there's any issue with the operation
            return res.sendStatus(statusConfig_1.default.serverError);
        }
    }
    catch (err) {
        console.log(err);
        //return a server error if an error occurs
        return res.sendStatus(statusConfig_1.default.serverError);
    }
    //sending an ok response upon successful update
    res.status(statusConfig_1.default.ok).json({ msg: "Subtask updated successfully" });
});
exports.updateSubtask = updateSubtask;
