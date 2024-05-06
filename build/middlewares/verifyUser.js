"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const statusConfig_1 = __importDefault(require("../config/statusConfig"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyUser = (req, res, next) => {
    const header = req.headers["authorization"];
    if (!header)
        return res.sendStatus(statusConfig_1.default.unauthorized);
    const token = header.split(" ")[1];
    if (!token)
        return res.sendStatus(statusConfig_1.default.unauthorized);
    try {
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err)
                throw new Error(err);
            req.user = {
                id: decoded.id,
                email: decoded.email
            };
        });
        next();
    }
    catch (err) {
        if (err) {
            return res.status(statusConfig_1.default.forbidden).json({ error: "Invalid Token" });
        }
    }
};
exports.default = verifyUser;
