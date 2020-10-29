import readline from "readline-sync";

const MAX_ID = 330000000;
const MIN_ID = 1;
const USER_NOT_FOUND = "Mhmm, unfortunately an account with that ID does not exist.";

const all_users = [
    {
        name: "Teuvo Testaaja",
        password: "epäturvallinensalasana",
        id: 1,
        balance: 25,
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
"Requests \n\ " +
"request_funds -- > Opens a dialog for requesting another user for funds. \n" +
"funds_requests -- > Shows all the requests for the account funds. \n" +
"accept_fund_request -- > Opens a dialog for accepting a fund request. \n");
}

const createId = function createId() {
    // harkitsin käyttäväni window.crypto.getRandomValues() tämän sijaan koska randomia
    // ei saisi käyttää mihinkää mikä liittyy turvallisuuteen.
    // ajattelin kumminkin ettei ID nyt välttämättä tarvi olla turvallisesti generoitu
    // **
    // Niin kauan kun löydetään user, kokeillaan uudella IDllä. Toki kun id määrä ylittää tietyn
    // rajan niin tämähän muuttuu epäkäytännölliseksi, silloin varmaan pitäisi olla tallessa jossain
    // idt mitä ei vielä käytetä.
    let returnedId = 0; // näemmä loopissa pyörivät arvot ei saa olla ulkopuolisia, tarvi 2 var.
    do {
        const randomId = Math.floor(Math.random() * (MAX_ID - MIN_ID + 1) + MIN_ID);
        const possibleUser = all_users.find((obj) => obj.id === parseInt(randomId, 10));
        if (typeof possibleUser === "undefined") {
            returnedId = randomId;
        }
    } while (typeof possibleUser !== "undefined"); // vissii parempi ois vaan (true) ja breakata.
    return returnedId;
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
        console.log(USER_NOT_FOUND);
        console.log(user);
    }
}

function withdrawFunds() {
    console.log("Okay, let's whip up some cash for you from these ones and zeroes");
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
    console.log(`Awesome, we validated you ${user.name}! How much money do you want to withdraw? ` +
                                                        `(Current balance: ${user.balance}€)`);
    let withdrawAmount = 0;
    do {
        withdrawAmount = readline.question();
        if (withdrawAmount > user.balance) {
            console.log("Unfortunately you don't have the balance for that. " +
                        "Let's try a smaller amount");
        }
    } while (withdrawAmount > user.balance);
    user.balance -= withdrawAmount;
    console.log(`Awesome, you can now enjoy your ${withdrawAmount}€ in cash! ` +
                `There's still ${user.balance}€ in your account, safe with us.`);
}

function depositFunds() {
    // tässä ja withdraw fundsissa on samoja osioita, joten voisi tehdä funktiot.
    console.log("Okay, let's convert your cash in to some delicious ones and zeroes.");
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
    console.log(`Awesome, we validated you ${user.name}! How much money do you want to deposit? ` +
                                                        `(Current balance: ${user.balance}€)`);
    const depositAmount = parseInt(readline.question(), 10); // tarkista onko numero.
    user.balance += depositAmount;
    console.log(`Awesome, we removed ${depositAmount}€ from existence and stored them into our ` +
                `system. Now your account's balance is ${user.balance}€`);
}

const cmds = {
    help: printHelp,
    create_account: createAccount,
    does_account_exist: checkAccount,
    withdraw_funds: withdrawFunds,
    deposit_funds: depositFunds,
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
