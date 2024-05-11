"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//app imports
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
//cors whitelist import
const corsWhitelist_1 = __importDefault(require("./config/corsWhitelist"));
//verify JWT middleware import
const verifyUser_1 = __importDefault(require("./middlewares/verifyUser"));
//app configurations
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use((0, cors_1.default)({
    origin: (origin, cb) => {
        if (corsWhitelist_1.default.includes(origin) || !origin) {
            cb(null, true);
        }
        else {
            cb(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
//route imports
const authRoute_1 = require("./routes/authRoute");
const taskRoute_1 = require("./routes/taskRoute");
//route usage
app.use(authRoute_1.router);
//routes that uses the verifyUser middleware
app.use(verifyUser_1.default);
app.use("/tasks", taskRoute_1.router);
//the welcome greeting at the root endpoint of the api
app.get("/", (req, res) => {
    res.status(200).send({ msg: "Welcome To CheckMate ✅" });
});
//server starts to listen for events/requests
app.listen(PORT, () => {
    console.log("Server Started on port:" + PORT);
});
