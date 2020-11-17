import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    id: String,
    name: String,
    password: String,
    balance: Number,
    fund_requests: Array,
});
// tänne voi nimetä collectionin jos haluaa.

const AccountModel = mongoose.model("account", accountSchema);
// collectionistä tulee vissiin automaagisesti accounts.

export default AccountModel;
