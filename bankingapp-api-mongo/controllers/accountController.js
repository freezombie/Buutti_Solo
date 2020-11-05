import accountModel from "../models/accountModel.js";

const MAX_ID = 320000000;
const MIN_ID = 10000

const NOT_FOUND = -1;
const UNAUTHORIZED = -2;

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
    } else if (req.body.password !== account.password) {
        return UNAUTHORIZED;
    } else return account;
}

export const newAccount = async (req, res) => {
    const { name, deposit, password } = req.body;
    if( deposit< 10) {
        res.status(500).send("\nNot enough money. Minimum initial deposit is 10 euros");
    } else { // vois kyl toisaalta tarkistaa onko kaikki tiedot.
        const id = await createId(req, res);
        const account = {
            id,
            name: standardizeName(name),
            password,
            balance: deposit,
            fund_requests: [],
        };
        const accountData = new accountModel(account);
        await accountData.save();
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

};

export const transferMoney = async (req,res) => {
    // withdrawmoney amount
    // depositmoney amount id
};

export const modifyAccount = async (req,res) => {
    // tänne sekä name ja pwd muokkauskutsut... ehkä se balancekin?
};