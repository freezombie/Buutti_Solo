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
    AccountModel.findOne({user: req.user._id}, (err, account) => {
        if(err) {
            res.status(500).send("Failed to find account");
        }
        return res.status(200).send(account);
    });
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
    AccountModel.findOne({user: req.user._id}, (err, account) => {
        if(err) {
            res.status(500).send("Failed to find account");
        }
        console.log(account);
        return res.send({account_balance: account.balance});
    });
};

export const modifyBalance = async (req, res) => {
    const account = await AccountModel.findOne({user: req.user._id}, (err) => {
        if(err) {
            res.status(500).send("Failed to find account");
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
    const account = await AccountModel.findOne({user: req.user._id}, (err) => {
        if(err) {
            res.status(500);
            return next(err);
        }
    });
    // tähän vois lisätä ettei voi asettaa itseänsä targetiksi.
    const targetUser = await UserModel.findOne({id: `${req.body.target_id}`}, (err, targetUser) => {
        if(!targetUser) {
            return res.status(500).send(`No user by ID: ${req.body.target_id}`);
        }
    });

    const targetAccount = await AccountModel.findOne({user: targetUser._id}, (err, targetAccount) => {
        if(!targetAccount) {
            return res.status(500).send(`No account associated to ID: ${req.body.target_id}`);
        }
        if(err) {
            return res.status(500).send("Error encountered while finding target users' account");
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
