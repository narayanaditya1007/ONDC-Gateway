const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const User = require('../models/Users');
const Ecommerce = require('../models/Ecommerces')
const bcrypt= require('bcrypt');
require('dotenv').config();

async function signup(req,res){
    try{
        console.log("hello");
        const existUser = await User.findOne({email:req.body.email});
        if(existUser){
            console.log("user exists");
            res.send("Email already exists, Try loggin in")
            throw new Error("Email already exists, Try loggin in")
        }
        const hashPass = await bcrypt.hash(req.body.password,10);
        const myId = new mongoose.Types.ObjectId();
        const user = new User({
            _id : myId,
            name : req.body.name,
            email : req.body.email,
            password: hashPass,
            phone: req.body.phone,
            user_type: req.body.userType,
            is_approved: false,
        });
        console.log(user)
        if(req.body.userType == 'seller'){
            const ecommerce = new Ecommerce({
                platform_id: myId,
                is_approved:false,
                domain: req.body.domain,
                getProduct:req.body.getProduct,
                placeOrder:req.body.placeOrder,
                cancelOrder:req.body.cancelOrder,
                getReview:req.body.getReview,
                addReview:req.body.addReview
            })

            await ecommerce.save();
        }
        await user.save();
        res.status(201).send(user);

    }catch(err){
        console.log("hello");
        console.log(err);
    }
}

async function logout(req,res){
    try{
        res.clearCookie('jwtToken').send("Logout Done")
    }
    catch(err){
        console.log(err);
    }
}

async function login(req,res){
    try{
        console.log("i reached login")
        const user=await User.findOne({email: req.body.email});
        console.log(user)
        if(!user){
            res.send("User not found")
            throw new Error("User not found");
        }
        // console.log("111");
        console.log(req.body.password);
        console.log(user.password)
        const isMatch = await bcrypt.compare(req.body.password,user.password);
        // console.log("222");
        if(!isMatch){
            res.send("Incorrect Password");
            throw new Error("Incorrect Password");
        }
        if(user.is_approved === undefined){
            res.send(" You are not approved, Wait or your approval");
            throw new Error("Not approved")
        }
        else if(user.is_approved === false){
            res.send("Your registration is rejected")
            throw new Error("Rejected")
        }


        const token = jwt.sign({email: user.email},process.env.SECRET_KEY);
        console.log("yha tak to ho gya");
        res.cookie("jwtToken",token,{
            httpOnly: true
        }).send({user,token});

    }
    catch(err){
        console.log(err);
    }
}


async function updateDetails(req,res){
    try{
        const user = await User.findById(req.body.UserId);
        user.phone = req.body.phone || user.phone;
        user.name = req.body.name || user.name;
        await user.save();
        res.send(user)
    }
    catch(err){
        console.log(err);
    }
}

async function approveUser(req,res){
    try{
        const user = await User.findById(req.body.requesterId);
        user.is_approved = true;
        const token = jwt.sign({userId: req.body.requesterId},process.env.SECRET_KEY);
        if(user.user_type=='seller'){
            const ecommerce = await Ecommerce.findOne({platform_id:user._id});
            console.log(ecommerce);
            ecommerce.is_approved= true;
            console.log(ecommerce);
            await ecommerce.save();
        }
        const ecommerce = await Ecommerce.find({platform_id:user._id});
        ecommerce.is_approved= true;
        user.token = token;
        await user.save();
        
        res.send(user)
    }
    catch(err){
        console.log(err);
    }
}

async function removeUser(req,res){
    try{
        const user = await User.findById(req.body.userId);
        user.is_approved = false;
        await user.save();
        res.send(user)
    }
    catch(err){
        console.log(err);
    }
}

async function getSeller(req,res){
    try{
        const allSeller = await User.find({user_type: "seller"});
        pendingSeller = allSeller.filter((seller)=>{
            if(seller.is_approved === undefined)return true;
        })
        
        res.send(pendingSeller);
    }
    catch(err){
        console.log(err);
    }
}

async function getBuyer(req,res){
    try{
        const allBuyer = await User.find({user_type: "buyer"});
        res.send(allSeller);
        pendingBuyer = allBuyer.filter((seller)=>{
            if(seller.is_approved === undefined)return true;
        })
        
        res.send(pendingBuyer);
    }
    catch(err){
        console.log(err);
    }
}

async function existingUser(req,res){
    try{
        const existing = await User.find({is_approved:"true"});
        res.send(existing);
    }
    catch(err){
        console.log(err);
    }
}



module.exports = {
    signup,
    login,
    logout,
    updateDetails,
    approveUser,
    removeUser,
    getSeller,
    getBuyer,
    existingUser

}