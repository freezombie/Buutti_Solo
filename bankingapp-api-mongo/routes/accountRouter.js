import express from "express";
import {
    newAccount,
    getBalance,
    transferMoney,
    modifyAccount,
} from "../controllers/accountController.js";
const router = express.Router();

router.post("/new", newAccount);
/*
router.post("/new", newStudent);
router.get("/all", getStudents);
router.get("/:id", getStudent); // järjestyksellä on väliä, jos tämä olisi ennen all, niin sillon idhen asetettaisiin tuo all.
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);
*/

export default router;