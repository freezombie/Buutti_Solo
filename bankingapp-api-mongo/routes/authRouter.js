import express from "express";
import {
    newUser,
    loginUser,
} from "../controllers/userController.js";

const authRouter = express.Router();

authRouter.post("/new", newUser);
authRouter.post("/login", loginUser);

export default authRouter;
