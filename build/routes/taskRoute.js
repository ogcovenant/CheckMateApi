"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const taskControllers_1 = require("../controllers/taskControllers");
const taskControllers_2 = require("../controllers/taskControllers");
const express_validator_1 = require("express-validator");
exports.router = express_1.default.Router();
exports.router.route("/add", [
    [
        (0, express_validator_1.body)("title").trim().notEmpty(),
        (0, express_validator_1.body)("dueDate").trim().notEmpty(),
        (0, express_validator_1.body)("priority").trim().notEmpty(),
        (0, express_validator_1.body)("tags").isArray(),
        (0, express_validator_1.body)("category").trim().notEmpty()
    ],
])
    .post(taskControllers_1.createTask);
exports.router.route("/")
    .get(taskControllers_2.getTasks);
exports.default = exports.router;
