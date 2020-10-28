import readline from "readline-sync";

const all_users = [
    {
        name: "Teuvo Testaaja",
        password: "epäturvallinensalasana",
        id: 1,
        balance: 25,
        fund_requests: [],
    },
]; // en oo varma toimiiko ylläoleva.

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
"Requests \n\ " +
"request_funds -- > Opens a dialog for requesting another user for funds. \n" +
"funds_requests -- > Shows all the requests for the account funds. \n" +
"accept_fund_request -- > Opens a dialog for accepting a fund request. \n");
}

const createId = function createId() {
    return 2;
};

function createAccount() {
    console.log("So you want to create a new account!");
    const name = readline.question("Let's start with the easy question. What is your name?\n");
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
    all_users[all_users.length] = account;
}

function checkAccount()
{
    const input = readline.question("Mhmm, you want to check if an account with an ID exists. " +
                                    "Let’s do it! Give us the ID and we’ll check.\n");
    // tässä vois tsekata onko numero.
    const user = all_users.find((obj) => obj.id === parseInt(input, 10));
    console.log(all_users);
    if (typeof user !== "undefined") {
        console.log("Awesome! This account actually exists. " +
        "You should confirm with the owner that this account is actually his.");
        console.log(user);
    } else {
        console.log("Mhmm, unfortunately an account with that ID does not exist.");
        console.log(user);
    }
}

const cmds = {
    help: printHelp,
    create_account: createAccount,
    does_account_exist: checkAccount,
};

console.log("Welcome to Pankkibank banking CLI");
while (true) {
    const input = readline.question("");
    if (input === "exit") {
        break;
    } else if (input in cmds) {
        cmds[input]();
    }
}
