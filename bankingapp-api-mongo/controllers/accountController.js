import { json } from "express";
import bcrypt from "bcrypt";
import accountModel from "../models/accountModel.js";

const MAX_ID = 320000000;
const MIN_ID = 10000

const NOT_FOUND = -1;
const UNAUTHORIZED = -2;

const encryptPassword = async (pwd) => {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(pwd,saltRounds);
    return hashedPassword;
}

const createId = async (req, res) => {
    let returnedId = 0;
    let possibleAccount = null;
    do {
        const randomId = Math.floor(Math.random() * (MAX_ID - MIN_ID + 1) + MIN_ID);
        possibleAccount = await accountModel.findOne({id: randomId});
        if (!possibleAccount) {
            returnedId = randomId;
        }
    } while (possibleAccount);
    return returnedId;
};

const standardizeName = function standardizeName(name) {
    const splitName = name.split(" ");
    let concattedName = "";
    splitName.forEach((namePart) => {
        concattedName += (namePart.charAt(0).toUpperCase() + namePart.slice(1)).concat(" ");
    });
    return concattedName.trim();
};

const validateUser = async (req) => {
    const account = await accountModel.findOne({id: req.params.id});
    if(!account) {
        return NOT_FOUND;
    } else if (!await bcrypt.compare(req.body.password, account.password)) {
        return UNAUTHORIZED;
    } else return account;
}

export const getAllAccounts = async(req,res) => {
    //for development and debugging. Delete when done.
    const accounts = await accountModel.find();
    let responseMsg = "";
    accounts.forEach(account => {
       responseMsg += account; 
    });
    res.send(responseMsg);
}

export const newAccount = async (req, res) => {
    const { name, deposit, password } = req.body;
    if( deposit< 10) {
        res.status(500).send("\nNot enough money. Minimum initial deposit is 10 euros");
    } else { // vois kyl toisaalta tarkistaa onko kaikki tiedot.
        const id = await createId(req, res);
        const hashedPassword = await encryptPassword(password);
        const account = {
            id,
            name: standardizeName(name),
            password: hashedPassword,
            balance: deposit,
            fund_requests: [],
        };
        const accountData = new accountModel(account);
        await accountData.save();
        account.password = req.body.password // ei haluta palauttaa enkryptoitua salasanaa
        res.json(account);
    }
};

export const getBalance = async (req, res) => {
    const account = await validateUser(req);
    switch (account) {
        case NOT_FOUND:
            return res.status(404).send("Account not found");
        case UNAUTHORIZED:
            return res.status(401).send("Failed to verify user. Wrong password?");
        default:
            return res.json({ balance: account.balance });
    }
};

export const modifyBalance = async (req, res) => {
    const account = await validateUser(req);
    switch (account) {
        case NOT_FOUND:
            return res.status(404).send("Account not found");
        case UNAUTHORIZED:
            return res.status(401).send("Failed to verify user. Wrong password?");
        default:
            const operation = 
                await accountModel.updateOne(account, { $inc: { balance: req.body.amount } });
                // Toimii miinusarvoillakin.
            if(operation.ok === 1) {
                // en halua hakea uudestaan tietokannasta, koska minusta se on turha haku.
                const balanceMsg = req.body.amount + account.balance;
                return res.json({ balance: balanceMsg });
            } else {
                return res.status(500).res.send("Database operation failed.");
            }
    }
};

export const transferMoney = async (req,res) => {
    const account = await validateUser(req);
    switch (account) {
        case NOT_FOUND:
            return res.status(404).send("Account not found");
        case UNAUTHORIZED:
            return res.status(401).send("Failed to verify user. Wrong password?");
        default:
            if(req.body.amount <= 0){
                return res.status(500).send("The amount must be positive");
            }
            const operation = 
                await accountModel.updateOne(account, { $inc: { balance: -req.body.amount } });
            const operation2 =
                await accountModel.updateOne({id: req.body.target_id}, { $inc: { balance: req.body.amount } });
            if(operation.ok === 1 && operation2.ok === 1) {
                const balanceMsg = account.balance - req.body.amount;
                return res.json({ balance: balanceMsg });
            } else {
                return res.status(500).res.send("Database operation failed.");
            }
    }
};
// alla olevaanhan periaatteessa vois yhistää balancenkin jos vaan tarkistaa että onko bodyssä mukana amounttia.
export const modifyAccount = async (req,res) => {
    const account = await validateUser(req);
    switch (account) {
        case NOT_FOUND:
            return res.status(404).send("Account not found");
        case UNAUTHORIZED:
            return res.status(401).send("Failed to verify user. Wrong password?");
        default:
            if(!"newName" in req.body && ! "newPassword" in req.body)
            {
                return res.status(500).send("Failed to find any required body parameters");
            }
            let returnJson;
            if ("newName" in req.body) {
                const operation = 
                    await accountModel.updateOne(account, { $set: { name: req.body.newName } });
                if(operation.ok === 1) {
                    returnJson = {name: req.body.newName};
                } else {
                    return res.status(500).res.send("Database operation failed.");
                }
            }
            if ("newPassword" in req.body) {
                const newPassword = await encryptPassword(req.body.newPassword);
                const operation = 
                    await accountModel.updateOne(account, { $set: { password: newPassword } });
                if(operation.ok === 1) {
                    returnJson.password = req.body.newPassword;
                } else {
                    return res.status(500).res.send("Database operation failed.");
                }
            }
            return res.json(returnJson);
    }    
};