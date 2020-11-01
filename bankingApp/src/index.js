import readline from "readline-sync";
import fs from "fs";

const MAX_ID = 330000000;
const MIN_ID = 1;
const USER_NOT_FOUND = "Mhmm, unfortunately an account with that ID does not exist.";

let validatedUser = null;

let all_users = [
    {
        name: "Teuvo Testaaja",
        password: "epäturvallinensalasana",
        id: 1,
        balance: 25,
        fund_requests: [],
    },
    {
        name: "Tessa Testaaja",
        password: "turvallinensalasana",
        id: 2,
        balance: 500,
        fund_requests: [],
    },
];

function printHelp() {
    console.log("\nI’m glad to help you :) Here’s a list of commands you can use! \n \n" +
"Accounts \n" +
"create_account -- > Opens dialog for creating an account. \n" +
"close_account -- > Opens a dialog for closing an account. \n" +
"modify_account -- > Opens a dialog for modifying an account. \n" +
"does_account_exist -- > Opens a dialog for checking if the account exists. \n" +
"log_in -- > Opens a dialog for logging in. \n" +
"logout -- > Opens a dialog for logging out. \n \n" +
"Funds \n" +
"withdraw_funds -- > Opens a dialog for withdrawing funds. \n" +
"deposit_funds -- > Opens a dialog for depositing funds. \n" +
"transfer_funds -- > Opens a dialog for transferring funds to another account. \n \n" +
"Requests \n" +
"request_funds -- > Opens a dialog for requesting another user for funds. \n" +
"funds_requests -- > Shows all the requests for the account funds. \n" +
"accept_fund_request -- > Opens a dialog for accepting a fund request. \n");
}

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

function logIn() {
    if (validatedUser) {
        console.log("an user is already logged in. Logout first");
        return;
    }
    let user = null;
    do {
        const id = readline.question("What is your account ID\n");
        user = all_users.find((obj) => obj.id === parseInt(id, 10));
        if (!user) {
            console.log(`${USER_NOT_FOUND} Try again!`);
        }
    } while (!user);
    console.log("Okay, we found an account with that ID. " +
    "You will need to insert your password so we can validate it's actually you");
    let pwd;
    do {
        pwd = readline.question();
        if (user.password !== pwd) {
            console.log("Ah, there must be a typo. Try typing it again.");
        }
    } while (user.password !== pwd);
    validatedUser = user;
    console.log(`Awesome, we validated you ${validatedUser.name}!`);
}

const standardizeName = function standardizeName(name) {
    const splitName = name.split(" ");
    let concattedName = "";
    splitName.forEach((namePart) => {
        concattedName += (namePart.charAt(0).toUpperCase() + namePart.slice(1)).concat(" ");
    });
    return concattedName.trim();
};

function createAccount() {
    console.log("So you want to create a new account!");
    console.log("Let's start with the easy question. What is your name?\n");
    const name = standardizeName(readline.question());
    console.log(`Hey ${name}! It's great to have you as a client.`);
    let balance = readline.question("How much cash do you want to deposit to get " +
                                     "started with your account? (10€ is the minimum)\n");
    while (balance < 10) {
        balance = readline.question("Unfortunately we can’t open an account for such a small sum." +
        " Do you have any more cash with you?\n");
    }
    const id = createId();
    console.log(`Great ${name}! You now have an account (ID: ${id})` +
    ` with a balance of ${balance}€.`);
    const pwd = readline.question("We're happy to have you as a customer, " +
    "and we want to ensure that your money is safe with us. Give us a password," +
    " which gives only you the access to your account.\n");
    const account = {};
    account.name = name;
    account.password = pwd;
    account.id = id;
    account.balance = balance;
    account.fund_requests = [];
    all_users = [...all_users, account];
    console.log("Your account has now been created and you have been returned to the main menu");
}
const getNumberInput = function getNumberInput() {
    let supposedNumber = null;
    do {
        supposedNumber = readline.question();
        if (Number.isNaN(supposedNumber)) {
            console.log("Please insert a number");
        }
    } while (Number.isNaN(supposedNumber));
    return supposedNumber;
};

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
}

function logOut() {
    if (!validatedUser) {
        console.log("No user is currently logged in");
    } else {
        const input = readline.question("Are you sure you want to logout? (yes/no)\n");
        if (input.toLowerCase() === "yes") {
            console.log("Logging you out...");
            validatedUser = null;
        } else if (input.toLowerCase() === "no") {
            console.log("You are still logged in as you wished for.");
        } else {
            console.log("Invalid input. Type logout again if needed");
        }
    }
}

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

const findTargetUser = function findTargetUser() {
    let possibleUser = null;
    do {
        const id = readline.question();
        possibleUser = all_users.find((obj) => obj.id === parseInt(id, 10));
        if (!possibleUser) {
            console.log(`${USER_NOT_FOUND} Try again!`);
        }
    } while (!possibleUser);
    return possibleUser;
};

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

function requestFunds() {
    if (!validatedUser) {
        logIn();
    }
    console.log("So you want to request funds from someone? Give us their ID.");
    const targetUser = findTargetUser();
    console.log("Okay, we found an account with that ID. How much money do you want to request?");
    const requestedAmount = parseInt(getNumberInput(), 10);
    console.log(`Awesome! We'll request that amount from the user with ID ${targetUser.id}`);
    const request = {
        forId: validatedUser.id,
        amount: requestedAmount,
    };
    targetUser.fund_requests = [...targetUser.fund_requests, request];
}

function printFundRequests() {
    if (!validatedUser) {
        logIn();
    }
    console.log("Here's all the requests are out for your funds:");
    if (validatedUser.fund_requests.length === 0) {
        console.log("There are no requests for your funds.");
    } else {
        validatedUser.fund_requests.forEach((request) => {
            console.log(`${request.amount}€ for user ID ${request.forId}`);
        });
    }
}

function acceptFundRequests() {
    if (!validatedUser) {
        logIn();
    }
    if (validatedUser.fund_requests.length === 0) {
        console.log("There are no requests for your funds.");
        return;
    }
    console.log("So you want to accept someones fund request? Give us their ID");
    let targetRequest = null;
    do {
        const id = readline.question();
        targetRequest = validatedUser.fund_requests.find((obj) => obj.forId === parseInt(id, 10));
        if (!targetRequest) {
            console.log("There's no request for your funds from that account ID. Try again?");
        }
    } while (!targetRequest);
    console.log(`Okay, we found a request for your funds for ${targetRequest.amount}€.` +
                " Accept request? (yes/no)");
    let validInput = false;
    do {
        const input = readline.question();
        if (input.toLowerCase() === "yes") {
            validInput = true;
            if (validatedUser.balance < targetRequest.amount) {
                console.log("Unfortunately you don't have the balance for this kind of amount");
            } else {
                validatedUser.balance -= targetRequest.amount;
                const targetUser = all_users.find((user) => user.id === targetRequest.forId);
                targetUser.balance += targetRequest.amount;
                validatedUser.fund_requests =
                validatedUser.fund_requests.filter((request) => request !== targetRequest);
                console.log("Good! Now these funds have been transferred " +
                `to the account with ID ${targetRequest.forId}`);
            }
        } else if (input.toLowerCase() === "no") {
            console.log("You did not accept the request, " +
            "therefore no funds have been transferred.");
            validInput = true;
        } else {
            console.log("Invalid input. Try again!");
        }
    } while (!validInput);
}

const cmds = {
    help: printHelp,
    create_account: createAccount,
    does_account_exist: checkAccount,
    modify_account: modifyAccount,
    withdraw_funds: withdrawFunds,
    deposit_funds: depositFunds,
    transfer_funds: transferFunds,
    log_in: logIn,
    logout: logOut,
    request_funds: requestFunds,
    funds_requests: printFundRequests,
    accept_fund_request: acceptFundRequests,
};

if (!fs.existsSync("savedData.JSON")) {
    console.log("... data does not exist, creating it now ...");
    fs.writeFileSync("savedData.JSON", JSON.stringify(all_users), (error) => {
        if (error) {
            console.log("... Failed while trying to write to file ...");
        } else {
            console.log("... Data saved into a file ...");
        }
    });
} else {
    all_users = JSON.parse(fs.readFileSync("savedData.JSON"));
}

let running = true;
console.log("Welcome to Pankkibank banking CLI");
while (running) {
    const input = readline.question("");
    if (input === "exit") {
        console.log(".. Exiting the program and saving data ...");
        fs.writeFileSync("savedData.JSON", JSON.stringify(all_users));
        running = false;
    } else if (input in cmds) {
        cmds[input]();
    } else {
        console.log("Invalid input. Try typing 'help'");
    }
}
