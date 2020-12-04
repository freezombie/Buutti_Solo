import express from "express";
import {
    modifyUser,
    getAll,
    testUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/all", getAll);
userRouter.get("/test", testUser);
userRouter.put("/modify/", modifyUser);

export default userRouter;
