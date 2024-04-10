const mongoose = require('mongoose');

const EcommerceSchema = mongoose.Schema({
    platform_id: mongoose.Schema.Types.ObjectId,
    is_approved:Boolean,
    domain: String,
    getProduct:String,
    placeOrder:String,
    cancelOrder:String,
    getReview:String,
    addReview:String
})

const Ecommerce = mongoose.model('Ecommerce',EcommerceSchema);
module.exports = Ecommerce;