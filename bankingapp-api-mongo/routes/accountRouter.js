import express from "express";
import {
    newAccount,
    getBalance,
    getAllAccounts,
    modifyBalance,
    transferMoney,
    modifyAccount,
} from "../controllers/accountController.js";
const router = express.Router();

router.post("/new", newAccount);
router.get("/all", getAllAccounts);
router.get("/:id", getBalance);
router.put("/:id", modifyBalance);
router.put("/transfer/:id", transferMoney);
router.put("/modify/:id", modifyAccount); // ois kyl nätimpi ku ois yhistettynä modifybalanceen.

export default router;