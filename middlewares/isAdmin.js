const User = require('../models/Users');

const isAdmin = async (req,res,next)=>{
   try{ 
        const user=await User.findById(req.body.UserId);
        if(user.user_type!="admin"){
            console.log(user.user_type);
            throw Error("Not an authorized Admin");
        }
        console.log("Admin Access");
        next();
    }
    catch(err){
        console.log(err);
    }
}

module.exports = isAdmin