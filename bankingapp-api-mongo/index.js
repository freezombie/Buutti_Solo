import express from "express";
import mongoose from "mongoose";
import accountRouter from "./routes/accountRouter.js";
import authRouter from "./routes/authRouter.js";
import expressJwt from "express-jwt";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";

dotenv.config();
const app = express();

//require("dotenv").config();

const requestLogger = (req, res, next) => {
    console.log(`METHOD: ${req.method}`);
    console.log(`PATH: ${req.path}`);
    console.log("BODY: ", req.body);
    console.log("QUERY: ", req.query);
    console.log("----");
    next();
};

const mongoUrl = "mongodb://localhost:27017/pankkibankDB";

const connectMongoose = async () => {
    await mongoose.connect(
        mongoUrl,
        { useNewUrlParser: true, useUnifiedTopology: true },
    );
};

connectMongoose();
app.use(express.json());
app.use(requestLogger);
app.use("/api", expressJwt({ secret: process.env.SECRET, algorithms: ['HS256'] }))
app.use("/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/user", userRouter);

app.use((err,res) => {
    console.error(err);
    if (err.name === "UnauthorizedError") {
        res.status(err.status);
    }
    return res.send({ message: err.message});
});

app.listen(5000, () => {
    console.log("listening to port 5000");
});
