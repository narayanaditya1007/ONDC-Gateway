const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    password:String,
    email: String,
    phone: String,
    user_type: String,
    is_approved: Boolean,
    token: String
})

const User = mongoose.model("User",UserSchema);
module.exports = User;