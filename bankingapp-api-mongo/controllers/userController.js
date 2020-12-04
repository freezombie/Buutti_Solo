import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import {
    newAccount,
} from "./accountController.js";

const MAX_ID = 320000000;
const MIN_ID = 10000;

export const testUser = async (req, res) => {
    const user = await UserModel.findOne({ id: req.user.id }, (err) => {
        if (err) {
            res.status(500).send("Failed while finding user");
        }
    });
    return res.status(200).send(user);
};

const encryptPassword = async (pwd) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pwd, saltRounds);
    return hashedPassword;
};

const createId = async () => {
    let returnedId = 0;
    let possibleUser = null;
    do {
        const randomId = Math.floor(Math.random() * (MAX_ID - MIN_ID + 1) + MIN_ID);
        possibleUser = await UserModel.findOne({ id: randomId });
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

export const getAll = async (req, res) => {
    const users = await UserModel.find();
    res.json(users);
};

export const newUser = async (req, res) => {
    console.log("MAKING NEW USER");
    const { name, deposit, password } = req.body;
    if (deposit < 10) {
        res.status(500).send("\nNot enough money. Minimum initial deposit is 10 euros");
    } else { // vois kyl toisaalta tarkistaa onko kaikki tiedot.
        const id = await createId(req, res);
        const hashedPassword = await encryptPassword(password);
        const user = {
            id,
            name: standardizeName(name),
            password: hashedPassword,
        };
        const userData = new UserModel(user);
        const returnedUser = await userData.save();
        console.log(returnedUser);
        // If the user signs up, we might as well give them a token right now
        // So they don't then immediately have to log in as well
        const token = jwt.sign(returnedUser.toObject(), process.env.SECRET);
        const account = await newAccount(req, res, userData._id);
        // varmaan account.user pitäs piilottaa. Salasana kanssa?
        return res.status(201).send({
            success: true, user: returnedUser.toObject(), account, token,
        });
    }
};

export const loginUser = async (req, res) => {
    const user = await UserModel.findOne({ id: req.body.id }, (err, foundUser) => {
        if (err) {
            return res.status(500).send("Failed while finding user");
        }
        if (!foundUser) {
            return res.status(403).send("User ID incorrect");
        }
    });
    if (!(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(403).send("Password incorrect");
    }
    const token = jwt.sign(user.toObject(), process.env.SECRET);
    return res.send({ token, user: user.toObject(), success: true });
};

export const modifyUser = async (req, res) => {
    const user = await UserModel.findOne({ id: req.user.id }, (err) => {
        if (err) {
            res.status(500).send("Failed while finding user");
        }
    });
    if (!("newName" in req.body) && !("newPassword" in req.body)) {
        return res.status(500).send("Failed to find any required body parameters");
    }
    let returnJson;
    /* await AccountModel.updateOne(account, { $inc: { balance: -req.body.amount } }, (err) => {
        if(err){
            return res.status(500).send("Couldn't update own account balance");
        }
    }); */
    let operationUpdateName = null;
    let operationUpdatePwd = null;
    if ("newName" in req.body) {
        operationUpdateName =
            await UserModel.updateOne(user, { $set: { name: req.body.newName } }, (err) => {
                if (err) {
                    return res.status(500).send("Failed while updating to a new name");
                }
            });
    }
    if ("newPassword" in req.body) {
        const newPassword = await encryptPassword(req.body.newPassword);
        operationUpdatePwd =
                await UserModel.updateOne(user, { $set: { password: newPassword } }, (err) => {
                    if (err) {
                        return res.status(500).send("Failed while updating to a new password");
                    }
                });
    }
    if (operationUpdateName !== null && operationUpdateName.ok === 1) {
        returnJson = { name: req.body.newName };
    }
    if (operationUpdatePwd !== null && operationUpdatePwd.ok === 1) {
        returnJson = { ...returnJson, password: req.body.newPassword };
    }
    // tässä kohtaa mietin että pitäisikö updatea token joka kulkee,
    // mutta kun se tärkein siellä on se _id niin mitä väliä vaikka kulkee väärä nimi mukana.
    return res.json(returnJson);
};
