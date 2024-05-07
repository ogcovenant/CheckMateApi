"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
const express_validator_1 = require("express-validator");
exports.router = express_1.default.Router();
exports.router
    .route("/signup", [
    [
        (0, express_validator_1.body)("email").trim().notEmpty().isEmail(),
        (0, express_validator_1.body)("password").trim().notEmpty(),
    ],
])
    .post(userControllers_1.createUser);
exports.router
    .route("/login", [
    [
        (0, express_validator_1.body)("email").trim().notEmpty().isEmail(),
        (0, express_validator_1.body)("password").trim().notEmpty(),
    ],
])
    .post(userControllers_1.loginUser);
exports.router
    .route("/forgotten-password", [[(0, express_validator_1.body)("email").trim().notEmpty().isEmail()]])
    .post(userControllers_1.forgottenPassword);
exports.router
    .route("/reset-password", [
    [
        (0, express_validator_1.body)("password").trim().notEmpty()
    ]
])
    .post(userControllers_1.resetPassword);
exports.default = exports.router;
