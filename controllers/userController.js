
const User = require("../models/User");
const passport = require("passport")
const OcrImg = require("../models/OCRImg")
const asyncHandler = require("express-async-handler");
const vision = require("@google-cloud/vision");
exports.getLogin = async (req,res)=>{

    
    res.render("Login",{
        title:"Login",
        user:req.user,
        success:"",
        err:"",
    });
};


exports.login = async (req, res, next) => {
    console.log("Login request body:", req.body);

    passport.authenticate("local", (err, user, info) => {
        console.log("req.user : ",req.user)
        console.log("user after login : ",user);
        if (err) {
            console.error("Authentication error:", err);
            return next(err);
        }

        if (!user) {
            return res.render("Login", {
                title: "Login",
                // user: req.user,
                error: info ? info.message : "Invalid email or password",
                success: ""
            });
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error("Login error:", err);
                return res.render("Login", {
                    title: "Login",
                    // user: req.user,
                    error: "Login failed. Please try again.",
                    success: ""
                });
            }

            // Ensure session is saved before redirecting
            req.session.save((err) => {
                if (err) {
                    console.error("Session save error:", err);
                    return next(err);
                }

                // Store user ID in a secure cookie
                res.cookie("userId", user.id, {
                    httpOnly: true,
                    secure: false, 
                    maxAge: 24 * 60 * 60 * 1000  
                });

                console.log("User logged in successfully:", user.id);
                return res.redirect("/Home");
            });
        });
    })(req, res, next);
};



exports.logout = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        console.log(err);
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }

            // Clear the session cookie
            res.clearCookie('connect.sid'); // Replace 'connect.sid' with your session cookie name if different
            res.clearCookie('userId');
            // Redirect to the home page or login page
            res.redirect("/Home");
        });
    });
};

exports.Register = async (req,res)=>{
    const {username,email,password} = req.body;
    const user = await User.findOne({email});
    if(user){
        res.render("Register",{message:"email already exists"})
    }
    const newUser = await User.create({
        username,
        email,
        password
    });
    console.log(newUser);
    res.render("Register",{
        titl:"Redister",
        success:"",
    });
}

exports.getHome = async(req,res)=>{
     
    const user = req.cookies.userId;
    console.log(req.session);


    const existUser = await User.findById(user);
    if(existUser){
       return res.render("Home",{
            title:"Home",
            success:"LoggedIn",
            err:"",
            user:existUser,
            message:""
            });
    }
    res.render("Home",{
        title:"Home",
        err:"",
        user:req.user,
        message:""
        });
    
    
};




exports.UploadImg = asyncHandler(async (req, res) => {
    // Check if the file is uploaded
    console.log(req.body);
    if (!req.body) {
        const user = req.cookies.userId;
        const existUser = await User.findById(user);
        console.log(existUser);
        return res.render("Home",{
            message:"",
            err:"",
            user:existUser,
        })
    }
    process.env.GOOGLE_APPLICATION_CREDENTIALS = "C:/Users/balaj/OneDrive/Desktop/nodejs/nodep/smartocr/google.json";
    const client = new vision.ImageAnnotatorClient();
   
    async function detectText() {
      const [result] = await client.textDetection(req.body.imageUrl); // Change to your image path
      const detections = result.textAnnotations;
       return detections[0]?.description || "No text found";
     
    }
    let content = await detectText();
    content = content.replace(/\n/g,"  ");
    // Cloudinary stores the URL and public ID in req.file
    const images = {
        public_id: req.body.public_id, // Cloudinary public ID
        url: req.body.imageUrl, // Cloudinary URL
        content: content,
    };

    console.log("Uploaded Image Details:", images);
    
    const user = req.cookies.userId;
    const existUser = await User.findById(user);
    // Save the image details to the database
    const ocrimg = new OcrImg({
        postBy: existUser,
        images: images,
    });

    await ocrimg.save();


    return res.render("Home",{
        message:content,
        err:"",
        user:existUser,
    })
});

exports.getRegister = async (req,res)=>{
    res.render("Register",{
        title:"register",
        success:"",
        err:"",
        user:req.user,
    });
}