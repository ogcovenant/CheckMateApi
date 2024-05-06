"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const subtaskControllers_1 = require("../controllers/subtaskControllers");
const subtaskControllers_2 = require("../controllers/subtaskControllers");
const subtaskControllers_3 = require("../controllers/subtaskControllers");
exports.router = express_1.default.Router();
exports.router.route("/add")
    .post(subtaskControllers_1.createSubtaskTask);
exports.router.route("/:id")
    .delete(subtaskControllers_2.deleteSubtask)
    .patch(subtaskControllers_3.updateSubtask);
exports.default = exports.router;
