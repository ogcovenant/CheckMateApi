import express from "express";
import {
  createUser,
  loginUser,
  forgottenPassword,
  resetPassword
} from "../controllers/userControllers";
import { body } from "express-validator";

export const router = express.Router();

router
  .route("/signup", [
    [
      body("email").trim().notEmpty().isEmail(),
      body("password").trim().notEmpty(),
    ],
  ])
  .post(createUser);

router
  .route("/login", [
    [
      body("email").trim().notEmpty().isEmail(),
      body("password").trim().notEmpty(),
    ],
  ])
  .post(loginUser);

router
  .route("/forgotten-password", [[body("email").trim().notEmpty().isEmail()]])
  .post(forgottenPassword);

router
  .route("/reset-password", [
    [
      body("password").trim().notEmpty()
    ]
  ])
  .post(resetPassword);

export default router;
