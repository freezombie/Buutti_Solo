import express from "express";
import mongoose from "mongoose";
import accountRouter from "./routes/accountRouter.js"

const requestLogger = (req, res, next) => {
    console.log(`METHOD: ${req.method}`);
    console.log(`PATH: ${req.path}`);
    console.log("BODY: ", req.body);
    console.log("QUERY: ", req.query);
    console.log("----");
    next();
};

const app = express();
const mongoUrl = "mongodb://localhost:27017/pankkibankDB";
// pankkibankDB on db nimi.

const connectMongoose = async () => {
    await mongoose.connect(
        mongoUrl,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
}

connectMongoose();
app.use(express.json());
app.use(requestLogger);
app.use("/accounts/", accountRouter);

app.listen(5000, () => {
    console.log("listening to port 5000");
});