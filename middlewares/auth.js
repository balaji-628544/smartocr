module.exports={
    ensureAuthenticated:(req,res,next) => {
        // console.log(req.body);
        
        if(req.isAuthenticated()){
            return next();
        }
       
        // let id = req.cookies.userId;
        // console.log("cookie : ",id);
        // if(id){
        //    return next();
        // }
        res.redirect("/Login")
    }
}