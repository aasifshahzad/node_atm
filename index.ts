import inquirer from "inquirer";
import { faker } from "@faker-js/faker";
// user data
// atm machine
// atm function

interface User {
    id: number;
    pin: number;
    name: string;
    accountNumber: number;
    balance: number;
}

const createUsers = (numberOfUser: number) => {
    let usersArray: User[] = [];
    for (let u = 1; u < numberOfUser; u++) {
        let user: User = {
            id: u,
            pin: u + 1000,
            name: faker.person.fullName(),
            accountNumber: Math.floor(10000000000000000 * Math.random()),
            balance: 100000 * u,
        };
        usersArray.push(user);
    }
    return usersArray;
};

const users = createUsers(10); // Create 10 Users
// 1console.log(users);

const atmMachine = async (users: User[]) => {
    let firstQuestion = await inquirer.prompt(
        // First Message from ATM to USER.
        [
            {
                type: "input",
                message: "Insert the card and dial your PIN code", // message from ATM
                name: "pin",
            },
        ]
    );
    const pinCode: number = parseInt(firstQuestion.pin); // Pin code entered by the user
    console.log(pinCode);

    const user = users.find((val) => val.pin == pinCode); // validating pin code

    if (user) {
        console.log(`Welcome! ${user.name} to the NodeJs ATM`); // valid user
        atmFunction(user);
    } else {
        console.log("Invalid pin, Please dial the correct Pin Code"); // invalid user
    }
};




const atmFunction = async (user: User) => {
    let secondQuestion = await inquirer.prompt(
        // Second Message from ATM to user after validating Pin Code
        [
            {
                type: "list",
                message: "What you want to perform", // Message from ATM
                name: "userResponse",
                choices: [                          // Activities an ATM can perform
                    "Balance Inquiry",
                    "Fast Cash",
                    "Withdrawal",
                    "Transfer Funds",
                    "Exit",
                ], 
            },
        ]
    );
    let userResponse: string = secondQuestion.userResponse;

    function handleResponse(userResponse: string) {  // perform activities according to the userResponse
        switch (userResponse) {
            case "Balance Inquiry": // Balance check
                var balance: number = user.balance;
                var balanceAmount = `Balance: Rs ${balance}`;
                return balanceAmount;
            case "Fast Cash": // Preset cash withdrawal
                const fastCashHandler = async (userResponse: string) => {
                    let cash = await inquirer.prompt([ // asking user to make choice for pre select amount
                        {
                            type: "list",  
                            message: "Select the amount You want to draw: ",
                            choices: ["500", "1000", "2000", "3000", "4000", "5000"],
                            name: "fastCashOption",
                        },
                    ]);
                    let fastCashAmount: number = parseInt(cash.fastCashOption);
                    if (fastCashAmount > user.balance) { // checking the user balance
                        console.log("Entered amount exceeds your current balance");
                    } else {
                        let newBalance = user.balance - fastCashAmount;
                        user.balance = newBalance; //updating balance
                        console.log(`Rs ${fastCashAmount} has been detected from your Account.`); //response from system
                        console.log(`Please take your cash Rs ${fastCashAmount}.`);
                        console.log(`You have Rs ${user.balance} in your account.`);
                        console.log("Fast cash operation completed.");

                    };
                }
                let fastCash = fastCashHandler(userResponse);
                return fastCash;
            case "Withdrawal": // user entered amount for withdrawal
                const withdrawlresponse = async (userResponse: string) => {
                    let response = await inquirer.prompt(
                        [
                            {
                                type: "input",
                                message: "Enter the withdrawal Amount: ", //amount to be withdraw
                                name: "withdrawalAmount",
                            }
                        ]
                    )
                    let withdrawalAmount: number = parseInt(response.withdrawalAmount)
                    if (withdrawalAmount > user.balance) { // checking the user balance
                        console.log("Entered amount exceeds your current balance");
                    } else {
                        let newBalance = user.balance - withdrawalAmount;
                        user.balance = newBalance; //updating balance
                        console.log(`Rs ${withdrawalAmount} has been detected from your Account.`); //system response
                        console.log(`Please take your cash Rs ${withdrawalAmount}.`);
                        console.log(`You have Rs ${user.balance} in your account.`);
                        console.log("Withdrawal cash operation completed.");
                    };
                };
                let withdrawal = withdrawlresponse(userResponse)
                return withdrawal;
            case "Transfer Funds": //fund transfer
                const transferResponse = async (userResponse: string) => {
                    let response = await inquirer.prompt(
                        [
                            {
                                type: "input",
                                message: "Enter the Bank name: ",
                                name: "bank",
                            },
                            {
                                type: "input",
                                message: "Enter the Account number: ",
                                name: "accountNumber",
                            },
                            {
                                type: "input",
                                message: "Enter the amount to be Transfer : ",
                                name: "withdrawalAmount",
                            }
                        ]
                    )
                    let bank: string = response.bank
                    let accountNumber: number | string = response.accountNumber
                    let transferAmount: number = parseInt(response.withdrawalAmount)
                    if (transferAmount > user.balance) { //checking user balance
                        console.log("Entered amount exceeds your current balance");
                    } else {
                        let newBalance = user.balance - transferAmount;
                        user.balance = newBalance; // updating balance
                        console.log(`Rs ${transferAmount} has been detected from your Account.`);  // system response
                        console.log(`Rs ${transferAmount} has been transferred to ${bank} Bank for Account number ${accountNumber}.`);
                        console.log(`You have Rs ${user.balance} in your account.`);
                        console.log("Transfer cash operation completed.");
                    }
                };
                let transfer = transferResponse(userResponse);
                return transfer;
            case "Exit": // cancel transition
                let exit: string = "Thanks for using NodeJS ATM";
                return exit;
            default:
                console.log("You did not make any selection");
                return;
        }
    }
    let response = handleResponse(userResponse);
    console.log(response);
};

atmMachine(users);


