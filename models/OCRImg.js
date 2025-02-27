const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    postBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    images:[
        {
            url:{
                type:String,
                required:true
            },
            public_id:{
                type:String,
                required:true
            },
            content:{
                type:String,
            }
        }
    ]
},{timestamps:true});



const OcrImg = mongoose.model("OcrImg",schema);

module.exports = OcrImg;
