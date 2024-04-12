const express = require('express');
const User_controller=require('../controllers/UserController');
const isAdmin = require('../middlewares/isAdmin')
const authenticate_login = require('../middlewares/authenticateLogin')

const Router = express.Router();


// user login
Router.post('/user/login',User_controller.login);


// user singup
Router.post('/user/signup',User_controller.signup);

// user logout
Router.post('/user/logout',User_controller.logout)

// update user detail
Router.put('/user/update-details',authenticate_login,User_controller.updateDetails);

// get sellers
Router.get('/user/getSeller',authenticate_login,isAdmin,User_controller.getSeller);

// get buyers
Router.get('/user/getBuyer',authenticate_login,isAdmin,User_controller.getBuyer);

// approve 
Router.put('/user/approve',authenticate_login,isAdmin,User_controller.approveUser);

// remove 
Router.put('/user/remove',authenticate_login,isAdmin,User_controller.removeUser);




module.exports= Router;