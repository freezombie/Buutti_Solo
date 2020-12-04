import express from "express";
import {
    getBalance,
    getAllAccounts,
    modifyBalance,
    transferMoney,
    testAccount,
} from "../controllers/accountController.js";

const accountRouter = express.Router();

accountRouter.get("/test", testAccount);
accountRouter.get("/all", getAllAccounts);
accountRouter.get("/", getBalance);
accountRouter.put("/", modifyBalance);
accountRouter.put("/transfer/", transferMoney);
accountRouter.get("/test", testAccount);

export default accountRouter;
