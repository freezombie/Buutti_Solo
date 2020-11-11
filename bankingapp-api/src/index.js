import express from "express";
import { json, urlencoded } from "body-parser";
import fs from "fs";

const app = express();
app.use(json());
app.use(urlencoded({ extended: false }));

const MAX_ID = 330000000;
const MIN_ID = 1;

// ERRORS
const NOT_FOUND = -1;
const UNAUTHORIZED = -2;
const ERROR_WRITING_FILE = -3;
const ERROR_READING_FILE = -4;
// let allUsers = [];

const readFromFile = () => {
    if (!fs.existsSync("savedData.JSON")) {
        return ERROR_READING_FILE;
    } return JSON.parse(fs.readFileSync("savedData.JSON"));
};

app.use((req, res, next) => {
    console.log(`METHOD: ${req.method}`);
    console.log(`PATH: ${req.path}`);
    console.log("BODY: ", req.body);
    console.log("QUERY: ", req.query);
    console.log("ALL USERS: ", readFromFile());
    console.log("----");
    next();
});

const writeToFile = async (data) => {
    fs.writeFile("savedData.JSON", JSON.stringify(data), (err) => {
        if (err) {
            console.log("returning error");
            return ERROR_WRITING_FILE;
            // res.status(500).json({ error: "FAILED WRITING TO FILE" }).end();
        }
        console.log("returning true");
        return 1;
    });
};

const createId = function createId() {
    let returnedId = 0;
    let possibleUser = null;
    do {
        const randomId = Math.floor(Math.random() * (MAX_ID - MIN_ID + 1) + MIN_ID);
        const accounts = readFromFile();
        if (accounts === ERROR_READING_FILE) {
            return randomId;
        }
        possibleUser = accounts.find((obj) => obj.id === parseInt(randomId, 10));
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

const validateUser = function validateUser(req) {
    const accounts = readFromFile();
    if (accounts === ERROR_READING_FILE) return ERROR_READING_FILE;
    const user = accounts.find((account) => account.id === parseInt(req.params.user_id, 10));
    if (!user) {
        return NOT_FOUND;
    }
    const { pwd } = req.body;
    if (pwd !== user.password) {
        return UNAUTHORIZED;
        // res.status(401).end();
    }
    return user;
};

// parameters the user should send to the API
// path for endpoint
// value the banking API should send back

// POST
// name, initial deposit, password
// /bank/user
// user_id
app.post("/bank/user", async (req, res) => {
    const name = standardizeName(req.body.name);
    const { deposit } = req.body;
    if (deposit < 10) {
        return res.send(`${JSON.stringify(req.body)}\nERROR: DEPOSIT TOO LOW`).end();
    }
    const { pwd } = req.body;
    const id = createId();
    const account = {
        name,
        password: pwd,
        id,
        balance: deposit,
        fund_requests: [],
    };
    const accounts = readFromFile();
    let newAccounts;
    if (accounts === ERROR_READING_FILE) {
        newAccounts = [account];
    } else {
        newAccounts = [...accounts, account];
    }
    const jotain = await writeToFile(newAccounts);
    console.log(jotain);
    if (writeToFile(newAccounts)) {
        return res.json({ user_id: account.id });
    }
    return res.status(500).send("Error writing to file");
});
// GET
// password
// /bank/:user_id/balance
// account_balance
app.get("/bank/:user_id/balance", (req, res) => {
    const user = validateUser(req);
    switch (user) {
    case NOT_FOUND:
        return res.status(404).send("\nUSER NOT FOUND");
    case UNAUTHORIZED:
        return res.status(401).send("\nWrong password or otherwise unauthorized");
    case ERROR_WRITING_FILE:
        return res.status(500).send("\nError writing file");
    default:
        return res.json({ balance: user.balance });
    }
});
// PUT
// password, amount
// /bank/:user_id/withdraw
// new_account_balance (error if not enough value on account)
app.put("/bank/:user_id/withdraw", (req, res) => {
    const user = validateUser(req);
    switch (user) {
    case NOT_FOUND:
        return res.status(404).send("\nUSER NOT FOUND");
    case UNAUTHORIZED:
        return res.status(401).send("\nWrong password or otherwise unauthorized");
    case ERROR_WRITING_FILE:
        return res.status(500).send("\nError writing file");
    default: {
        const withdrawAmount = req.body.amount;
        if (withdrawAmount > user.balance) {
            return res.status(401).json({
                error: "NOT ENOUGH MONEY ON ACCOUNT",
                balance: user.balance,
            });
        }
        user.balance -= withdrawAmount;
        const accounts = readFromFile();
        if (accounts === ERROR_READING_FILE) {
            return res.status(500).send("Error reading from file");
        }
        const filteredAccounts = accounts.filter((userInArray) => userInArray.id !== user.id);
        const newAccounts = [...filteredAccounts, user];
        if (writeToFile(newAccounts)) return res.json({ balance: user.balance });
        return res.status(500).send("Error writing to file");
    }
    }
});
// PUT
// password, amount
// /bank/:user_id/deposit
// new_account_balance
app.put("/bank/:user_id/deposit", (req, res) => {
    const user = validateUser(req);
    switch (user) {
    case NOT_FOUND:
        return res.status(404).send("\nUSER NOT FOUND");
    case UNAUTHORIZED:
        return res.status(401).send("\nWrong password or otherwise unauthorized");
    case ERROR_WRITING_FILE:
        return res.status(500).send("\nError writing file");
    default: {
        const depositAmount = req.body.amount;
        user.balance += depositAmount;
        const accounts = readFromFile();
        if (accounts === ERROR_READING_FILE) {
            return res.status(500).send("Error reading from file");
        }
        const filteredAccounts = accounts.filter((userInArray) => userInArray.id !== user.id);
        const newAccounts = [...filteredAccounts, user];
        if (writeToFile(newAccounts)) return res.json({ balance: user.balance });
        return res.status(500).send("Error writing to file");
    }
    }
});
// EXTRA PUT
// password, recipient_id, amount
// /bank/:user_id/transfer
// new_account_balance (error if not enough value on account)
app.put("/bank/:user_id/transfer", (req, res, next) => {
    const user = validateUser(req);
    switch (user) {
    case NOT_FOUND:
        return res.status(404).send("\nUSER NOT FOUND");
    case UNAUTHORIZED:
        return res.status(401).send("\nWrong password or otherwise unauthorized");
    case ERROR_WRITING_FILE:
        return res.status(500).send("\nError writing file");
    default: {
        const recipient =
                readFromFile().find(
                    (customer) => customer.id === parseInt(req.body.recipient_id, 10),
                );
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
        const accounts = readFromFile();
        if (accounts === ERROR_READING_FILE) {
            return res.status(500).send("Error reading from file");
        }
        const filteredAccounts = accounts.filter(
            (userInArray) => userInArray.id !== user.id && userInArray.id !== recipient.id,
        );
        const newAccounts = [...filteredAccounts, user, recipient];
        if (writeToFile(newAccounts)) return res.json({ balance: user.balance });
        return res.status(500).send("Error writing to file");
    }
    }
});
// EXTRA PUT
// UPDATE NAME
// password, new_name
// /bank/:user_id/name
// new_username
app.put("/bank/:user_id/name", (req, res) => {
    const user = validateUser(req);
    switch (user) {
    case NOT_FOUND:
        return res.status(404).send("\nUSER NOT FOUND");
    case UNAUTHORIZED:
        return res.status(401).send("\nWrong password or otherwise unauthorized");
    case ERROR_WRITING_FILE:
        return res.status(500).send("\nError writing file");
    default: {
        user.name = standardizeName(req.body.new_name);
        const accounts = readFromFile();
        if (accounts === ERROR_READING_FILE) return res.status(500).send("Error reading from file");
        const filteredAccounts = accounts.filter((userInArray) => userInArray.id !== user.id);
        const newAccounts = [...filteredAccounts, user];
        if (writeToFile(newAccounts)) return res.json({ name: user.name });
        return res.status(500).send("Error writing to file");
    }
    }
});
// EXTRA PUT
// UPDATE PASSWORD
// password, new_password
// /bank/:user_id/password
// new_password
app.put("/bank/:user_id/password", (req, res) => {
    const user = validateUser(req);
    switch (user) {
    case NOT_FOUND:
        return res.status(404).send("\nUSER NOT FOUND");
    case UNAUTHORIZED:
        return res.status(401).send("\nWrong password or otherwise unauthorized");
    case ERROR_WRITING_FILE:
        return res.status(500).send("\nError writing file");
    default: {
        user.password = req.body.new_password;
        const accounts = readFromFile();
        if (accounts === ERROR_READING_FILE) return res.status(500).send("Error reading from file");
        const filteredAccounts = accounts.filter((userInArray) => userInArray.id !== user.id);
        const newAccounts = [...filteredAccounts, user];
        if (writeToFile(newAccounts)) return res.json({ password: user.password });
        return res.status(500).send("Error writing to file");
    }
    }
});

app.listen(5000);
