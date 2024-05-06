"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const listControllers_1 = require("../controllers/listControllers");
const listControllers_2 = require("../controllers/listControllers");
const listControllers_3 = require("../controllers/listControllers");
const listControllers_4 = require("../controllers/listControllers");
const listControllers_5 = require("../controllers/listControllers");
exports.router = express_1.default.Router();
exports.router.route("/add")
    .post(listControllers_1.createList);
exports.router.route("/")
    .get(listControllers_2.getList);
exports.router.route("/:id")
    .patch(listControllers_4.updateList);
exports.router.route("/:id")
    .delete(listControllers_3.deleteList);
exports.router.route("/:id/tasks")
    .get(listControllers_5.getListTasks);
exports.default = exports.router;
