const express = require("express");
const userRouter = require("./routes/UserRouter");
const app = express();
const passport = require("passport");
const session = require("express-session");
const mongoose  = require("mongoose");
const passportconfig = require("./config/passport");
const parser = require("cookie-parser");
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(session({
    secret: "hello",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Use true if you're on HTTPS in production
        httpOnly: true, // Make the cookie HTTP-only
        maxAge: 24 * 60 * 60 * 1000 // Expire in 1 day
    }
}));
app.use(parser());
passportconfig(passport);
app.use(passport.initialize());
app.use(passport.session());


app.use("/",userRouter);

mongoose.connect("mongodb://localhost:27017/smartocr").then(()=>{
    console.log("DataBase is Connected");
})

app.listen(8115, ()=> console.log("Server started at 4000"));