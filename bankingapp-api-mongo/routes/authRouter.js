import express from "express";
import {
    newUser,
    loginUser,
    getAll,
} from "../controllers/userController.js";
const authRouter = express.Router();

authRouter.post("/new", newUser);
authRouter.post("/login", loginUser);
authRouter.get("/all", getAll);


export default authRouter;