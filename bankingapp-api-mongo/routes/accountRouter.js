import express from "express";
import {
    getBalance,
    getAllAccounts,
    modifyBalance,
    transferMoney,
    modifyAccount,
    testAccount,
} from "../controllers/accountController.js";

const accountRouter = express.Router();

accountRouter.get("/test", testAccount);
accountRouter.get("/all", getAllAccounts);
accountRouter.get("/", getBalance);
accountRouter.put("/:id", modifyBalance);
accountRouter.put("/transfer/:id", transferMoney);
accountRouter.put("/modify/:id", modifyAccount); // ois kyl nätimpi ku ois yhistettynä modifybalanceen.
accountRouter.get("/test", testAccount);

export default accountRouter;
