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
exports.deleteTask = exports.editTask = exports.getTasks = exports.createTask = void 0;
//route imports
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
const statusConfig_1 = __importDefault(require("../config/statusConfig"));
const nanoid_1 = require("nanoid");
const express_validator_1 = require("express-validator");
//a controller function to create a task
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //validating the request body using express validator
    const errors = (0, express_validator_1.validationResult)(req);
    //sending an error if the values provided were invalid
    if (!errors.isEmpty()) {
        return res
            .status(statusConfig_1.default.notAcceptable)
            .json({ msg: "Invalid values provided" });
    }
    //creating a task object to hold the data to be stored in the database
    const task = {
        id: (0, nanoid_1.nanoid)(),
        title: req.body.title,
        due_date: req.body.dueDate,
        priority: req.body.priority,
        note: req.body.note,
        user_id: req.user.id,
        status: "pending",
    };
    //checking if the values recieved are not empty
    if (!task.id ||
        !task.title ||
        !task.due_date ||
        !task.priority ||
        !task.note) {
        return res
            .status(statusConfig_1.default.notAcceptable)
            .json({ msg: "Invalid values provided" });
    }
    //inserting the task into the database
    try {
        //query to insert
        yield dbconfig_1.default.task.create({
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
    }
    catch (err) {
        console.log(err);
        //returning a server error status if an issue occurs with the operation
        return res.sendStatus(statusConfig_1.default.serverError);
    }
    //saving a notification
    try {
        yield dbconfig_1.default.notifications.create({
            data: {
                id: (0, nanoid_1.nanoid)(),
                title: "Task Created Successfully",
                description: `You just created a new task: ${task.title}`,
                type: "creation",
                userId: task.user_id,
            },
        });
    }
    catch (err) {
        console.log(err);
        //returning a server error status if an issue occurs with the operation
        return res.sendStatus(statusConfig_1.default.serverError);
    }
    //returning an ok response upon successful creation of task
    res.status(statusConfig_1.default.created).json({ msg: "Task Created Successfully" });
});
exports.createTask = createTask;
//a controller method to get the list of tasks belonging to a single user 
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //getting the user making the request
    const userId = req.user.id;
    try {
        //query to get the tasks from the backend
        const tasks = yield dbconfig_1.default.task.findMany({
            where: {
                userId: userId,
            }
        });
        if (!tasks)
            return res
                .status(statusConfig_1.default.notFound)
                .json({ error: "You don't have any task" });
        res
            .status(statusConfig_1.default.ok)
            .json({ msg: "Task Fetched Successfully", tasks: tasks });
    }
    catch (err) {
        //returning a server error status if an issue occurs with the operation
        return res.sendStatus(statusConfig_1.default.serverError);
    }
});
exports.getTasks = getTasks;
//a controller method to update the task whose id was specified
const editTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.id;
    //validating the request body using express validator
    const errors = (0, express_validator_1.validationResult)(req);
    //sending an error if the values provided were invalid
    if (!errors.isEmpty()) {
        return res
            .status(statusConfig_1.default.notAcceptable)
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
    if (!task.title ||
        !task.due_date ||
        !task.priority ||
        !task.status ||
        !task.note) {
        return res.status(statusConfig_1.default.notAcceptable).json({ msg: "Invalid values provided" });
    }
    try {
        yield dbconfig_1.default.task.update({
            where: {
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
        res.sendStatus(statusConfig_1.default.ok).json({ msg: "Task updated successfully" });
    }
    catch (err) {
        console.log(err);
        //sending an error if the task could not be updated
        return res.sendStatus(statusConfig_1.default.serverError);
    }
});
exports.editTask = editTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.id;
    try {
        yield dbconfig_1.default.task.delete({
            where: {
                id: taskId,
            }
        });
        // await db.tag.deleteMany({
        //   where:{
        //     taskId: taskId
        //   }
        // })
        res.status(statusConfig_1.default.noContent).json({ msg: "Task Deleted Successfully" });
    }
    catch (err) {
        return res.sendStatus(statusConfig_1.default.serverError);
    }
});
exports.deleteTask = deleteTask;
