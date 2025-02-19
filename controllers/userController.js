
const User = require("../models/User");
const passport = require("passport")
const OCRImg = require("../models/OCRImg")
exports.getLogin = async (req,res)=>{

    
    res.render("Login",{
        title:"Login",
        user:req.user,
        success:"",
        err:"",
    });
};


// exports.login = async (req,res,next)=>{
    
//     console.log(req.body);
    
//     passport.authenticate("local",(err,user,info)=>{
//         if(err){
//             console.log(err)
//             return next(err);
//         }
//         console.log(user);
//         if(!user){
//             return res.render("Login",{
//                 title: "login",
//                 user: req.user,
//                 error: info.message,
//                 success:""
//             });
//         }
//         // console.log(req.logIn);
//         req.logIn(user,(err)=>{
//             if(err){
//                 return next(err);
//             }

            
           
//             return res.redirect("/Home");

//         });
//     })(req,res,next);
//     }

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
     
    // res.render("Home");
    // const user = req.cookies.userId;
    // console.log(req.session);
    // console.log("User"+req.user);

    // const existUser = await User.findById(user);
    // if(existUser){
    //    return res.render("Home",{
    //         title:"Home",
    //         success:"LoggedIn",
    //         err:"",
    //         user:existUser,
    //         });
    // }
    res.render("Home",{
        title:"Home",
        err:"",
        success:"",
        // user:req.user,
    })
    
};


// exports.UploadImg = async(req,res)=>{
//     if(!req.file || req.files === 0){
//         return res.render("Home",{
//             err:"Image is required!!",
//             success:"",
//         })
//     }
//     const images = {
//        public_id:req.filename,
//         url:file.path,
//         content:""
//     };
//     console.log(ocrimg);
//     const ocrimg = new OCRImg({
//         postBy:req.body,
//         images,
//     });
//     await ocrimg.save();
//     res.render("Home",{
//         title:"Home",
//         user:req.user,
//         content:"",
//         success:"LoggedIn",
//         err:"",

//     });
    
// }
exports.UploadImg = async (req, res) => {
    // Check if a file was uploaded
    console.log(req.file);
    if (!req.file) {
        return res.render("Home", {
            err: "Image is required!!",
            success: "",
            user:req.user,
        });
    }
  
    // Extract file details
    const images = {
        public_id: req.file.filename, // Use req.file.filename
        url: req.file.path, // Use req.file.path
        content: "" // You can populate this later
    };

    console.log("Uploaded Image:", images);

    try {
        // Save the image details to the database
        const ocrimg = new OCRImg({
            postBy: req.body.userId, // Example: Extract userId from req.body
            images: images,
        });

        await ocrimg.save();

        // Render the Home page with success message
        res.render("Home", {
            title: "Home",
            user: req.user,
            content: "",
            success: "Image uploaded successfully!",
            err: "",
        });
    } catch (error) {
        console.error("Error saving image:", error);
        res.render("Home", {
            title: "Home",
            user: req.user,
            content: "",
            success: "",
            err: "Failed to upload image. Please try again.",
        });
    }
};

// exports.loginHome = async(req,res)=>{
//     res.render("Home",{
//         title:"Home",
//         success:"LoggedIn",
//         err:"",
//         user:req.user,
//     });
// }

exports.getRegister = async (req,res)=>{
    res.render("Register",{
        title:"register",
        success:"",
        err:"",
        user:req.user,
    });
}