import mongoose from "mongoose";
import UserModel from "./userModel.js";

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: UserModel,
        required: true,
        unique: true,
    },
    balance: Number,
    fund_requests: Array,
});

const AccountModel = mongoose.model("account", accountSchema);

export default AccountModel;
