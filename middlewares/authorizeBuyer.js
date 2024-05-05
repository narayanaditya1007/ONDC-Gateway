
const User = require('../models/Users');
const jwt = require("jsonwebtoken")

const authorizeBuyer = async (req,res,next)=>{
   try{ 
        
        const token = req.header('Authorization').replace('Bearer ','');
        
        console.log(token);
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        console.log(decoded.userId);
        req.body.UserId= decoded.userId;
        const user=await User.findById(decoded.userId);
        console.log(user);
        if(user.user_type!="buyer"){
            console.log(user.user_type);
            throw Error("Not an authorized buyer");
        }
        console.log("Genuine Buyer");
        next();
    }
    catch(err){
        console.log(err);
    }
}

module.exports = authorizeBuyer