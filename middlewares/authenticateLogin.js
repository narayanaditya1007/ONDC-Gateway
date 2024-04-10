const jwt = require('jsonwebtoken');
const User = require('../models/Users');
require('dotenv').config();


const authenticateUser = async (req,res,next)=>{
    try{
        const token = req.cookies.jwtToken;
        console.log(token);
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        console.log(decoded)
        const user = await User.findOne({email: decoded.email});
        console.log(user);
        if(!user){
            throw Error("not authorized");
        }
        req.body.UserId = user._id;
        console.log(req.body.UserId);
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).send({ error: 'Please authenticate.' });
    }
}

module.exports= authenticateUser;