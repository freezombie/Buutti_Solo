import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    newAccount
} from "./accountController.js";

const MAX_ID = 320000000;
const MIN_ID = 10000;

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

export const newUser = async (req,res) => {
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
        await userData.save();
        // If the user signs up, we might as well give them a token right now
        // So they don't then immediately have to log in as well
        const token = jwt.sign(user, process.env.SECRET);
        user.password = req.body.password; // ei haluta palauttaa enkryptoitua salasanaa
        const account = await newAccount(req,res,userData._id);
        // varmaan account.user pitäs piilottaa. Salasana kanssa?
        return res.status(201).send({success: true, user: user, account: account, token});
    }
};

export const loginUser = async (req,res, next) => {
    UserModel.findOne({ id: req.body.id }, (err, user) => {
        if (err) {
            return next(err);
        };
        if(!user || !bcrypt.compare(req.body.password, user.password)) {
            res.status(403);
            return next(new Error("User ID or password are incorrect"));
        }
        const token = jwt.sign(user.toObject(), process.env.SECRET);
        return res.send({token: token, user: user.toObject(), success: true});
    });
};