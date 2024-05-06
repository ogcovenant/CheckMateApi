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
exports.forgottenPassword = exports.loginUser = exports.createUser = void 0;
//route imports
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const statusConfig_1 = __importDefault(require("../config/statusConfig"));
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
const nanoid_1 = require("nanoid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const nodemailer_1 = __importDefault(require("nodemailer"));
//a controller function to create user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //validating the request body using express validator 
    const errors = (0, express_validator_1.validationResult)(req);
    //sending an error if the values provided were invalid
    if (!errors.isEmpty()) {
        return res.status(statusConfig_1.default.notAcceptable).json({ msg: "Invalid values provided" });
    }
    //getting the request body and storing them
    const email = req.body.email;
    const password = req.body.password;
    //checking if a user is already present with the email
    try {
        //query to get the existing user
        const existingUser = yield dbconfig_1.default.user.findUnique({
            where: {
                email: email
            }
        });
        //returning a confilict status if there is a user existing with the email
        if (existingUser)
            return res.status(statusConfig_1.default.conflict).json({ error: "User with email already exists" });
    }
    catch (err) {
        console.log(err);
        //returning an error if there is any error with the operation
        return res.sendStatus(statusConfig_1.default.serverError);
    }
    //creating a dynamic id and hashing the user password
    const id = (0, nanoid_1.nanoid)();
    const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
    //creating a user object to be encoded into the JWT
    const user = {
        id,
        email
    };
    //creating the access and refresh tokens
    const accessToken = jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
    //an array to store the data been saved into the database
    const userData = {
        id: id,
        email: email,
        password: hashedPassword
    };
    //inserting the user into the database
    try {
        //query to insert the user into the database
        yield dbconfig_1.default.user.create({
            data: userData
        });
    }
    catch (err) {
        //returning an error if there is any issue with the operation
        return res.sendStatus(statusConfig_1.default.serverError);
    }
    //sending the access token with a success message
    res.status(statusConfig_1.default.ok).json({ msg: "Account Created Successfully", accessToken: accessToken });
});
exports.createUser = createUser;
//a controller function to login the user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //validating the request body using express validator 
    const errors = (0, express_validator_1.validationResult)(req);
    //sending an error if the values provided were invalid
    if (!errors.isEmpty()) {
        return res.status(statusConfig_1.default.notAcceptable).json({ msg: "Invalid values provided" });
    }
    //getting the request body and storing them
    const email = req.body.email;
    const password = req.body.password;
    //searching the database to see if the user with the above email exists
    try {
        //query to search the database
        const existingUser = yield dbconfig_1.default.user.findUnique({
            where: {
                email: email
            }
        });
        //sending a 404 status if the user was not found
        if (!existingUser)
            return res.status(statusConfig_1.default.notFound).json({ error: "You are not signed up yet" });
        //matching the password to see if the passwords match
        const match = yield bcryptjs_1.default.compare(password, existingUser.password);
        //sending a not authorized status if the passwords do not match
        if (!match)
            return res.status(statusConfig_1.default.unauthorized).json({ error: "Invalid Password" });
        //storind the data required for jwt creation in an object
        const userData = {
            id: existingUser.id,
            email: existingUser.email
        };
        //generating an access token
        const accessToken = jsonwebtoken_1.default.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
        //sending the success message along with the access token
        res.status(statusConfig_1.default.ok).json({ msg: "Login Successful", accessToken: accessToken });
    }
    catch (err) {
        //sending a server error status if any error occurs in the above operation
        return res.sendStatus(statusConfig_1.default.serverError);
    }
});
exports.loginUser = loginUser;
//a controller to handle forgotten password request
const forgottenPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //validating the request body using express validator 
    const errors = (0, express_validator_1.validationResult)(req);
    //sending an error if the values provided were invalid
    if (!errors.isEmpty()) {
        return res.status(statusConfig_1.default.notAcceptable).json({ msg: "Invalid email provided" });
    }
    const email = req.body.email;
    //searching the database to see if the user with the above email exists
    try {
        //query to search the database
        const existingUser = yield dbconfig_1.default.user.findUnique({
            where: {
                email: email
            }
        });
        //sending a 404 status if the user was not found
        if (!existingUser)
            return res.status(statusConfig_1.default.notFound).json({ error: "You are not signed up yet" });
        //constructing the expiry date
        const date = new Date();
        date.setHours(date.getHours() + 2);
        //create a reset for the current reset 
        const reset = {
            id: (0, nanoid_1.nanoid)(),
            expiresIn: date,
            userId: existingUser.id
        };
        //pushing the reset date to the database
        yield dbconfig_1.default.resetPasswordTable.create({
            data: reset
        });
        //getting the resetID
        const resetId = yield dbconfig_1.default.resetPasswordTable.findFirst({
            where: {
                userId: existingUser.id
            }
        });
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "justcovenant@gmail.com",
                pass: "escz neom labs ronu"
            },
        });
        try {
            const info = yield transporter.sendMail({
                from: '"CheckMate" <justcovenant@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Reset Password", // Subject line
                html: `<div style="display: flex; flex-direction: column; align-items: center; margin-top: 20px; font-family: Arial"><div style="max-width: 600px; margin: 40px auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px;"><h2 style="color: #333; font-weight: bold; margin-bottom: 20px;">Reset your password</h2><p>Dear User,</p><p style="font-size: 16px; margin-bottom: 30px;">We received a request to reset your password. Click the link below to create a new password and regain access to your account.</p><a href="https://checkmate-x.vercel.app/reset-password/${resetId === null || resetId === void 0 ? void 0 : resetId.id}" style="background-color: #ffcc24; color: #000; font-style: bold; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none;">Verify Email Address</a><div style="margin-top: 20px">Please note that this link is only valid for 2 hours. If you did not request a password reset, please ignore this email.</div><div><p>Best regards,<br />CheckMate</></div></div></div>`, // html body
                // Add these settings to help prevent spam flags
                sender: '"CheckMate" <justcovenant@gmail.com>', // sender address
                replyTo: '"CheckMate" <justcovenant@gmail.com>', // reply address
                priority: 'high', // email priority
                headers: {
                    'Precedence': 'bulk', // email precedence
                    'X-Priority': '3', // email priority (3 is high)
                },
            });
        }
        catch (error) {
            return res.sendStatus(statusConfig_1.default.serverError);
        }
        //sending the success message along with the access token
        res.status(statusConfig_1.default.ok).json({ msg: "Reset code sent" });
    }
    catch (err) {
        //sending a server error status if any error occurs in the above operation
        return res.sendStatus(statusConfig_1.default.serverError);
    }
});
exports.forgottenPassword = forgottenPassword;
