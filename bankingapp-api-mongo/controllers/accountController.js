import { json } from "express";
import bcrypt from "bcrypt";
import AccountModel from "../models/accountModel.js";
import UserModel from "../models/userModel.js";

const NOT_FOUND = -1;
const UNAUTHORIZED = -2;

export const getAllAccounts = async (req, res) => {
    // for development and debugging. Delete when done.
    const accounts = await AccountModel.find();
    res.json(accounts);
};

export const testAccount = async (req,res) => {
    return res.send(req.user);
}

export const newAccount = async (req, res, _id) => {
    const account = {
        user: _id,
        balance: req.body.deposit,
        fund_requests: []
    }
    const accountData = new AccountModel(account);
    await accountData.save();
    return account;
};

export const getBalance = async (req, res, next) => {
    // reqissä näemmä on piilossa tuo _id niin ei tarvii hakea useria erikseen siellä req.userissa kulkevalla normi idllä.
    AccountModel.findOne({id: req.user._id}, (err, account) => {
        if(err) {
            res.status(500);
            return next(err);
        }
        return res.send({account_balance: account.balance});
    });
};

export const modifyBalance = async (req, res) => {
    const account = await AccountModel.findOne({id: req.user._id}, (err) => {
        if(err) {
            res.status(500);
            return next(err);
        }
    });
    const operation = 
        await AccountModel.updateOne(account, { $inc: { balance: req.body.amount } });
    if (operation.ok === 1) {
        const balanceMsg = req.body.amount + account.balance;
        return res.json({ balance: balanceMsg });
    }
    return res.status(500).res.send("Database operation failed.");
};

export const transferMoney = async (req, res, next) => {
    const account = await AccountModel.findOne({id: req.user._id}, (err) => {
        if(err) {
            res.status(500);
            return next(err);
        }
    });

    const targetUser = await UserModel.findOne({id: `${req.body.target_id}`}, (err, targetUser) => {
        if(!targetUser) {
            return res.status(500).send(`No user by ID: ${req.body.target_id}`);
        }
    });

    const targetAccount = await AccountModel.findOne({user: targetUser._id}, (err, targetAccount) => {
        if(!targetAccount) {
            return res.status(500).send(`No account associated to ID: ${req.body.target_id}`);
        }
    });
    
    if (req.body.amount <= 0) {
        return res.status(500).send("The amount must be positive");
    }
    await AccountModel.updateOne(account, { $inc: { balance: -req.body.amount } }, (err) => {
        if(err){
            return res.status(500).send("Couldn't update own account balance");
        }
    });
    await AccountModel.updateOne(targetAccount,{ $inc: { balance: req.body.amount } }, (err) => {
        if(err){
            return res.status(500).send("Couldn't update target users' account");
        }
    });
    const balanceMsg = account.balance - req.body.amount;
    return res.send({ balance: balanceMsg });
};

// alla olevaanhan periaatteessa vois yhistää balancenkin
// jos vaan tarkistaa että onko bodyssä mukana amounttia.
export const modifyAccount = async (req, res) => {
    const account = await validateUser(req);
    switch (account) {
    case NOT_FOUND:
        return res.status(404).send("Account not found");
    case UNAUTHORIZED:
        return res.status(401).send("Failed to verify user. Wrong password?");
    default: {
        if (!("newName" in req.body) && !("newPassword" in req.body)) {
            return res.status(500).send("Failed to find any required body parameters");
        }
        let returnJson;
        if ("newName" in req.body) {
            const operation =
                    await AccountModel.updateOne(account, { $set: { name: req.body.newName } });
            if (operation.ok === 1) {
                returnJson = { name: req.body.newName };
            } else {
                return res.status(500).res.send("Database operation failed.");
            }
        }
        if ("newPassword" in req.body) {
            const newPassword = await encryptPassword(req.body.newPassword);
            const operation =
                    await AccountModel.updateOne(account, { $set: { password: newPassword } });
            if (operation.ok === 1) {
                returnJson.password = req.body.newPassword;
            } else {
                return res.status(500).res.send("Database operation failed.");
            }
        }
        return res.json(returnJson);
    }
    }
};
