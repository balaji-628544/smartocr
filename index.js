const express = require("express");
const userRouter = require("./routes/UserRouter");
const app = express();
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const passportconfig = require("./config/passport");
const parser = require("cookie-parser");
const User = require("./models/User");

app.set("view engine", "ejs");

app.use(parser()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "hello",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);


passportconfig(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use("/",userRouter);

mongoose.connect("mongodb://localhost:27017/smartocr")
    .then(() => console.log("Database is Connected"))
    .catch(err => console.error("Database Connection Error:", err));

app.listen(4000, ()=> console.log("Server started at 4000"));
