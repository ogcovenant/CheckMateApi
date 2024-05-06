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
exports.getThisWeekTask = exports.getTomorrowTask = exports.getTodayTask = exports.createTask = void 0;
const statusConfig_1 = __importDefault(require("../config/statusConfig"));
const joi_1 = __importDefault(require("joi"));
const nanoid_1 = require("nanoid");
const getWeekAndDays_1 = require("../utils/getWeekAndDays");
//schema for validation 
const taskSchema = joi_1.default.object({
    title: joi_1.default.string(),
    due_date: joi_1.default.string(),
});
//a controller function to create a task
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //getting the request body
    const requestBody = req.body;
    //creating a task object with the values of the new task to be created
    const task = {
        id: (0, nanoid_1.nanoid)(),
        title: requestBody.title,
        due_date: requestBody.due_date,
        no_of_subtasks: 0,
        list_id: requestBody.list_id || "",
        user_id: req.user.id,
        status: "pending"
    };
    //performing validation
    const titleRaw = taskSchema.validate({ title: task.title });
    const dueDateRaw = taskSchema.validate({ due_date: task.due_date });
    if (titleRaw.error || dueDateRaw.error) {
        return res.status(statusConfig_1.default.notAcceptable).json({ error: "Invalid Values Provided" });
    }
    //check if specified list is available
    if (task.list_id !== "") {
        try {
            // const [list] = await db.query("SELECT * FROM lists WHERE id = ?", [ task.list_id ]);
            // if(!list[0]) return res.status(STATUS.notFound).json({ error: "Selected List Does Not Exist" });
        }
        catch (err) {
            return res.sendStatus(statusConfig_1.default.serverError);
        }
    }
    //inserting the task into the database
    try {
        //creating a list of arrays to hold the data that is to be stored into the database
        const taskData = [
            task.id,
            task.title,
            task.due_date,
            task.no_of_subtasks,
            task.list_id,
            task.user_id,
            task.status
        ];
        //query to insert the data into the database
        // await db.query("INSERT INTO tasks ( id, title, due_date, no_of_subtasks, list_id, user_id, status )  VALUES ( ?, ?, ?, ?, ?, ?, ? )", taskData)
    }
    catch (err) {
        console.log(err);
        //returning a server error status if an issue occurs with the operation
        return res.sendStatus(statusConfig_1.default.serverError);
    }
    //returning an ok response upon successful creation of task
    res.status(statusConfig_1.default.ok).json({ msg: "Task Created Successfully" });
});
exports.createTask = createTask;
//a controller function to get the task for today
const getTodayTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //getting the current user and current date
    const user = req.user;
    const date = new Date().toLocaleDateString();
    //querying the database to get the tasks and associated subtasks
    try {
        const taskData = [
            user.id,
            date
        ];
        //query to get the tasks
        // const [ tasks ] = await db.query("SELECT tasks.*, (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', subtasks.id,'title', subtasks.title,'status', subtasks.status)) FROM subtasks WHERE subtasks.task_id = tasks.id ) AS subtasks FROM tasks WHERE user_id = ? AND due_date = ?;", taskData);
        //checking if the task list is not empty
        //sending a not found error if the task list is empty
        // if(!tasks[0]) return res.status(STATUS.notFound).json({ error: "Task List Is Empty" });
        //sending a success message and the tasks if the task was retrieved successfully
        // res.status(STATUS.ok).json({ msg: "Tasks Retrieved Successfully", tasks: tasks })
    }
    catch (err) {
        //sending a server error status if any error occurs during the operation
        return res.sendStatus(statusConfig_1.default.serverError);
    }
});
exports.getTodayTask = getTodayTask;
const getTomorrowTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const tomorrowDate = date.toLocaleDateString();
    try {
        // const [ tasks ] = await db.query("SELECT tasks.*, (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', subtasks.id,'title', subtasks.title,'status', subtasks.status)) FROM subtasks WHERE subtasks.task_id = tasks.id ) AS subtasks FROM tasks WHERE user_id = ? AND due_date = ?;", [ user.id, tomorrowDate ]);
        // if(!tasks[0]) return res.status(STATUS.notFound).json({ error: "Task List Is Empty" });
        // res.status(STATUS.ok).json({ msg: "Tasks Retrieved Successfully", tasks: tasks })
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(statusConfig_1.default.serverError);
    }
});
exports.getTomorrowTask = getTomorrowTask;
const getThisWeekTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const date = new Date();
    const weekDays = (0, getWeekAndDays_1.getWeekAndDays)(date);
    try {
        // const [ tasks ] = await db.query("SELECT tasks.*, (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', subtasks.id,'title', subtasks.title,'status', subtasks.status)) FROM subtasks WHERE subtasks.task_id = tasks.id ) AS subtasks FROM tasks WHERE user_id = ? AND due_date IN (?);", [ user.id, weekDays ]);
        // if(!tasks[0]) return res.status(STATUS.notFound).json({ error: "Task List Is Empty" });
        // res.status(STATUS.ok).json({ msg: "Tasks Retrieved Successfully", tasks: tasks })
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(statusConfig_1.default.serverError);
    }
});
exports.getThisWeekTask = getThisWeekTask;
