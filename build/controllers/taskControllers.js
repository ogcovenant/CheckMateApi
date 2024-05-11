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
exports.getTasks = exports.createTask = void 0;
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
        return res.status(statusConfig_1.default.notAcceptable).json({ msg: "Invalid values provided" });
    }
    //creating a task object to hold the data to be stored in the database
    const task = {
        id: (0, nanoid_1.nanoid)(),
        title: req.body.title,
        due_date: req.body.dueDate,
        priority: req.body.priority,
        tags: req.body.tags,
        category: req.body.category,
        no_of_subtasks: 0,
        user_id: req.user.id,
        status: "pending"
    };
    //checking if the values recieved are not empty
    if (!task.id ||
        !task.title ||
        !task.due_date ||
        !task.priority ||
        !task.tags ||
        !task.category) {
        return res.status(statusConfig_1.default.notAcceptable).json({ msg: "Invalid values provided" });
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
                noOfSubtasks: task.no_of_subtasks,
                status: task.status
            }
        });
        //inserting tags
        const tags = task.tags;
        tags.forEach((tag) => __awaiter(void 0, void 0, void 0, function* () {
            yield dbconfig_1.default.tag.create({
                data: {
                    id: (0, nanoid_1.nanoid)(),
                    title: tag,
                    taskId: task.id
                }
            });
        }));
        //inserting category
        yield dbconfig_1.default.category.create({
            data: {
                id: (0, nanoid_1.nanoid)(),
                title: task.category,
                taskId: task.id
            }
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
                userId: task.user_id
            }
        });
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
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.getTasks = getTasks;
