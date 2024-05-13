"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const taskControllers_1 = require("../controllers/taskControllers");
const taskControllers_2 = require("../controllers/taskControllers");
const taskControllers_3 = require("../controllers/taskControllers");
const taskControllers_4 = require("../controllers/taskControllers");
const express_validator_1 = require("express-validator");
exports.router = express_1.default.Router();
exports.router.route("/add", [
    [
        (0, express_validator_1.body)("title").trim().notEmpty(),
        (0, express_validator_1.body)("dueDate").trim().notEmpty(),
        (0, express_validator_1.body)("priority").trim().notEmpty(),
        (0, express_validator_1.body)("note").notEmpty()
    ],
])
    .post(taskControllers_1.createTask);
exports.router.route("/")
    .get(taskControllers_2.getTasks);
exports.router.route("/edit/:id", [
    [
        (0, express_validator_1.body)("title").trim().notEmpty(),
        (0, express_validator_1.body)("dueDate").trim().notEmpty(),
        (0, express_validator_1.body)("priority").trim().notEmpty(),
        (0, express_validator_1.body)("status").trim().notEmpty(),
        (0, express_validator_1.body)("note").notEmpty()
    ],
])
    .put(taskControllers_3.editTask);
exports.router.route("/delete/:id")
    .delete(taskControllers_4.deleteTask);
exports.default = exports.router;
