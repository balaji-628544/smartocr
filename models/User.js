const mongoose = require("mongoose");

const schema =  new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"OCRImg"
        }
    ]


},{timestamps:true});

const User = mongoose.model("User",schema);
module.exports = User;
