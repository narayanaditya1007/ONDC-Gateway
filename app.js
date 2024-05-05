const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const userRouter = require('./routers/UserRouter');
const ecommerceRoute = require('./routers/EcommerceRouter')
require('dotenv').config();

try{
mongoose.connect(process.env.MONGO_URI);
const app=express();
const PORT = process.env.PORT || 3000;
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin : ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
    source: 'http://localhost:3000',
    credentials: true
}))
app.use(userRouter);
app.use(ecommerceRoute)
app.listen(PORT,()=>{
    console.log(`Server started on port: ${PORT}`);
})
}
catch(err){
    console.log("mongoose not connected");
    console.log(err)
}
