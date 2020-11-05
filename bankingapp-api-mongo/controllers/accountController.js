import accountModel from "../models/accountModel.js";

const MAX_ID = 320000000;
const MIN_ID = 10000
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

export const newAccount = async (req, res) => {
    const { name, deposit, password } = req.body;
    if( deposit< 10) {
        res.status(500).send("\nNot enough money. Minimum initial deposit is 10 euros");
    } else { // vois kyl toisaalta tarkistaa onko kaikki tiedot.
        const id = await createId(req, res);
        console.log(typeof(id));
        console.log(id);
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

};

export const withdrawMoney = async (req, res) => {

};

export const depositMoney = async (req,res) => {

};

// yhdistä withdraw money ja deposit money käytännössä modify balanceksi?

export const transferMoney = async (req,res) => {
    // withdrawmoney amount
    // depositmoney amount id
};

export const modifyAccount = async (req,res) => {
    // tänne sekä name ja pwd muokkauskutsut... ehkä se balancekin?
};