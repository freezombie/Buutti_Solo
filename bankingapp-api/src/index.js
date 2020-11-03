import express from "express";
import { json, urlencoded } from "body-parser";
import fs from "fs";

const app = express();
app.use(json());
app.use(urlencoded({ extended: false }));

const MAX_ID = 330000000;
const MIN_ID = 1;
let all_users = [];

app.use((req, res, next) => {
    console.log(`METHOD: ${req.method}`);
    console.log(`PATH: ${req.path}`);
    console.log("BODY: ", req.body);
    console.log("QUERY: ", req.query);
    console.log("ALL USERS: ", JSON.stringify(all_users));
    console.log("----");
    next();
});

const createId = function createId() {
    let returnedId = 0;
    let possibleUser = null;
    do {
        const randomId = Math.floor(Math.random() * (MAX_ID - MIN_ID + 1) + MIN_ID);
        possibleUser = all_users.find((obj) => obj.id === parseInt(randomId, 10));
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

function readFromFile(res, next) {
    if (!fs.existsSync("savedData.JSON")) {
        console.log("... data does not exist, creating it now ...");
        fs.writeFile("savedData.JSON", JSON.stringify(all_users), (error) => {
            if (error) {
                res.status(500).send("ERROR: FAILED TO WRITE INIT FILE").end();
                return next(); // en oo ihan varma lopettaako tämä täältä app.postia.
            } return true; // eslint valittaa muuten kun ei ole consistent return.
        });
    } else {
        all_users = JSON.parse(fs.readFileSync("savedData.JSON"));
    }
}

function writeToFile() {
    fs.writeFile("savedData.JSON", JSON.stringify(all_users), (err) => {

    });
}

// parameters the user should send to the API
// path for endpoint
// value the banking API should send back

// POST
// name, initial deposit, password
// /bank/user
// user_id
app.post("/", (req, res, next) => {
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
    all_users = [...all_users, account];
    writeToFile();
    res.json(account);
});
/* 

// GET
// password
// /bank/:user_id/balance
// account_balance
function checkAccount() {
    console.log("Mhmm, you want to check if an account with an ID exists. " +
                "Let’s do it! Give us the ID and we’ll check.\n");
    const input = getNumberInput();
    const user = all_users.find((obj) => obj.id === parseInt(input, 10));
    console.log(all_users);
    if (user) {
        console.log("Awesome! This account actually exists. " +
        "You should confirm with the owner that this account is actually his.");
        console.log(user);
    } else {
        console.log(USER_NOT_FOUND);
        console.log(user);
    }
}

//PUT
// password, amount
// /bank/:user_id/withdraw
// new_account_balance (error if not enough value on account)
function withdrawFunds() {
    console.log("Okay, let's whip up some cash for you from these ones and zeroes");
    if (!validatedUser) {
        logIn();
    }
    console.log("How much money do you want to withdraw? " +
                `(Current balance: ${validatedUser.balance}€)`);
    let withdrawAmount = 0;
    do {
        withdrawAmount = readline.question();
        if (withdrawAmount > validatedUser.balance) {
            console.log("Unfortunately you don't have the balance for that. " +
                        "Let's try a smaller amount");
        }
    } while (withdrawAmount > validatedUser.balance);
    validatedUser.balance -= withdrawAmount;
    console.log(`Awesome, you can now enjoy your ${withdrawAmount}€ in cash! ` +
                `There's still ${validatedUser.balance}€ in your account, safe with us.`);
}

// PUT
// password, amount
// /bank/:user_id/deposit
// new_account_balance
function depositFunds() {
    console.log("Okay, let's convert your cash in to some delicious ones and zeroes.");
    if (!validatedUser) {
        logIn();
    }
    console.log("How much money do you want to deposit? " +
                `(Current balance: ${validatedUser.balance}€)`);
    const depositAmount = parseInt(getNumberInput(), 10);
    validatedUser.balance += depositAmount;
    console.log(`Awesome, we removed ${depositAmount}€ from existence and stored them into our ` +
                `system. Now your account's balance is ${validatedUser.balance}€`);
}

// EXTRA PUT
// password, recipient_id, amount
// /bank/:user_id/transfer
// new_account_balance (error if not enough value on account)
function transferFunds() {
    console.log("Okay, let's slide these binary treats into someone else's pockets");
    if (!validatedUser) {
        logIn();
    }
    console.log("How much money do you want to transfer? " +
                `(Current balance: ${validatedUser.balance}€)`);
    let transferAmount = 0;
    do {
        transferAmount = parseInt(readline.question(), 10);
        if (transferAmount > validatedUser.balance) {
            console.log("Unfortunately you don't have the balance for that. " +
                        "Let's try a smaller amount");
        }
    } while (transferAmount > validatedUser.balance);
    console.log("Awesome, we can do that. What is the ID of the account " +
                "you want to transfer these funds into?");
    const targetUser = findTargetUser();
    validatedUser.balance -= transferAmount;
    targetUser.balance += transferAmount;
    console.log(`Awesome. We sent ${transferAmount} to an account with the ID of ${targetUser.id}`);
}
// EXTRA PUTS
// UPDATE NAME
// password, new_name
// /bank/:user_id/name
// new_username
// UPDATE PASSWORD
// password, new_password
// /bank/:user_id/password
// new_password
function modifyAccount() {
    console.log("You want to modify an accounts stored holder name? We can definitely do that!");
    if (!validatedUser) {
        logIn();
    }
    console.log("What is the new name for the account holder?");
    let newName = validatedUser.name;
    do {
        newName = standardizeName(readline.question());
        if (newName === validatedUser.name) {
            console.log("I'm quite sure that's the same name. Try again!");
        }
    } while (newName === validatedUser.name);
    console.log(`There we go! We will address you as ${newName} from now on`);
    const userToChange = all_users.find((obj) => obj.id === parseInt(validatedUser.id, 10));
    userToChange.name = newName;
} */

app.listen(5000);