import express from "express";
import { json, urlencoded } from "body-parser";
import fs from "fs";

const app = express();
app.use(json());
app.use(urlencoded({ extended: false }));

const MAX_ID = 330000000;
const MIN_ID = 1;
let allUsers = [];

app.use((req, res, next) => {
    console.log(`METHOD: ${req.method}`);
    console.log(`PATH: ${req.path}`);
    console.log("BODY: ", req.body);
    console.log("QUERY: ", req.query);
    console.log("ALL USERS: ", JSON.stringify(allUsers));
    console.log("----");
    next();
});

const createId = function createId() {
    let returnedId = 0;
    let possibleUser = null;
    do {
        const randomId = Math.floor(Math.random() * (MAX_ID - MIN_ID + 1) + MIN_ID);
        possibleUser = allUsers.find((obj) => obj.id === parseInt(randomId, 10));
        if (!possibleUser) {
            returnedId = randomId;
        }
    } while (possibleUser);
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

const validateUser = function validateUser(req, res, next) {
    const user = allUsers.find((customer) => customer.id === parseInt(req.params.user_id, 10));
    if (!user) {
        res.status(404).end();
        return next();
    }
    const { pwd } = req.body;
    if (pwd !== user.password) {
        res.status(401).end();
        return next();
    }
    return user;
};

function readFromFile(res, next) {
    if (!fs.existsSync("savedData.JSON")) {
        console.log("... data does not exist, creating it now ...");
        fs.writeFile("savedData.JSON", JSON.stringify(allUsers), (error) => {
            if (error) {
                res.status(500).send("ERROR: FAILED TO WRITE INIT FILE").end();
                return next();
            } return true;
        });
    } else {
        allUsers = JSON.parse(fs.readFileSync("savedData.JSON"));
    }
}

function writeToFile(res, next) {
    fs.writeFile("savedData.JSON", JSON.stringify(allUsers), (err) => {
        if (err) {
            res.status(500).json({ error: "FAILED WRITING TO FILE" }).end();
            return next();
        } return true;
    });
}

// parameters the user should send to the API
// path for endpoint
// value the banking API should send back

// POST
// name, initial deposit, password
// /bank/user
// user_id
app.post("/bank/user", (req, res, next) => {
    readFromFile(res, next);
    const name = standardizeName(req.body.name);
    const { deposit } = req.body;
    if (deposit < 10) {
        res.send(`${JSON.stringify(req.body)}\nERROR: DEPOSIT TOO LOW`).end();
        return next();
    }
    const { pwd } = req.body;
    const id = createId();
    const account = {};
    account.name = name;
    account.password = pwd;
    account.id = id;
    account.balance = deposit;
    account.fund_requests = [];
    allUsers = [...allUsers, account];
    writeToFile(res, next);
    return res.json({ user_id: account.id });
});
// GET
// password
// /bank/:user_id/balance
// account_balance
app.get("/bank/:user_id/balance", (req, res, next) => {
    readFromFile();
    const user = validateUser(req, res, next);
    if (!user) {
        return null;
    }
    return res.json({ balance: user.balance });
});
// PUT
// password, amount
// /bank/:user_id/withdraw
// new_account_balance (error if not enough value on account)
app.put("/bank/:user_id/withdraw", (req, res, next) => {
    readFromFile();
    const user = validateUser(req, res, next);
    if (!user) {
        return null;
    }
    const withdrawAmount = req.body.amount;
    if (withdrawAmount > user.balance) {
        return res.status(401).json({
            error: "NOT ENOUGH MONEY ON ACCOUNT",
            balance: user.balance,
        });
    }
    user.balance -= withdrawAmount;
    writeToFile(res, next);
    return res.json({ new_account_balance: user.balance });
});
// PUT
// password, amount
// /bank/:user_id/deposit
// new_account_balance
app.put("/bank/:user_id/deposit", (req, res, next) => {
    readFromFile();
    const user = validateUser(req, res, next);
    if (!user) {
        return null;
    }
    const depositAmount = req.body.amount;
    user.balance += depositAmount;
    writeToFile(res, next);
    return res.json({ new_account_balance: user.balance });
});
// EXTRA PUT
// password, recipient_id, amount
// /bank/:user_id/transfer
// new_account_balance (error if not enough value on account)
app.put("/bank/:user_id/transfer", (req, res, next) => {
    readFromFile();
    const user = validateUser(req, res, next);
    if (!user) {
        return null;
    }
    const recipient =
        allUsers.find((customer) => customer.id === parseInt(req.body.recipient_id, 10));
    if (!recipient) {
        res.status(404).end();
        return next();
    }
    const transferAmount = req.body.amount;
    if (transferAmount > user.balance) {
        return res.status(401).json({
            error: "NOT ENOUGH MONEY ON ACCOUNT",
            balance: user.balance,
        });
    }
    user.balance -= transferAmount;
    recipient.balance += transferAmount;
    writeToFile(res, next);
    return res.json({ new_account_balance: user.balance });
});
// EXTRA PUT
// UPDATE NAME
// password, new_name
// /bank/:user_id/name
// new_username
app.put("/bank/:user_id/name", (req, res, next) => {
    readFromFile();
    const user = validateUser(req, res, next);
    if (!user) {
        return null;
    }
    user.name = standardizeName(req.body.new_name);
    writeToFile(res, next);
    return res.json({ new_user_name: user.name });
});
// EXTRA PUT
// UPDATE PASSWORD
// password, new_password
// /bank/:user_id/password
// new_password
app.put("/bank/:user_id/password", (req, res, next) => {
    readFromFile();
    const user = validateUser(req, res, next);
    if (!user) {
        return null;
    }
    user.password = req.body.new_password;
    writeToFile(res, next);
    return res.json({ new_password: user.password });
});

app.listen(5000);
