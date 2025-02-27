const express = require("express");
const User = require("../models/User");
const { ensureAuthenticated } = require("../middlewares/auth");
const {getLogin, login, Register,getHome, getRegister, UploadImg,logout} = require("../controllers/userController");
const upload = require("../config/multer");
const userRouter = express.Router();
const OCRImg = require("../models/OCRImg");

userRouter.get("/Login",getLogin);

userRouter.get("/",async(req,res)=>{
    res.render("Home",{
        title:"Home",
        err:"",
        success:"",
        user:req.user,
    })
});

userRouter.post("/Home",UploadImg);

userRouter.post("/Login",login);

userRouter.get("/Register",getRegister);

userRouter.post("/Register",Register);

userRouter.get("/Logout",logout);

userRouter.get("/Home",getHome);

module.exports = userRouter;