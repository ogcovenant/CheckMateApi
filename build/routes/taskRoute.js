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
exports.router = express_1.default.Router();
exports.router.route("/add")
    .post(taskControllers_1.createTask);
exports.router.route("/today")
    .get(taskControllers_2.getTodayTask);
exports.router.route("/tomorrow")
    .get(taskControllers_3.getTomorrowTask);
exports.router.route("/thisweek")
    .get(taskControllers_4.getThisWeekTask);
exports.default = exports.router;
