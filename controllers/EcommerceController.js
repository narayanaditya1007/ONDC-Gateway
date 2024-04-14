const Ecommerce = require('../models/Ecommerces');
const User = require('../models/Users')
const Redis = require('redis')


const DEFAULTEXP = 3600;

async function searchProduct(req,res){
    try{
      const redisClient = Redis.createClient();
      await redisClient.connect();
      console.log("connected to redis")

      const product = await redisClient.get("allProducts");
      if(product){
        res.json(JSON.parse(product));
      }
      else{
        try{
            let allProduct=[];
            const platforms =await Ecommerce.find();
            await Promise.all(platforms.map(async (platform)=>{
              if(platform.is_approved && platform.domain){
                const domain = platform.domain;
                const route = platform.getProduct;
                const user = await User.findById(platform.platform_id);
                const token = user.token
                console.log(domain);
                // console.log(route);
                const response = await fetch(domain+route, {
                    method: "GET",
                    headers: {
                      "Authorization": "Bearer "+token,
                    "Content-type": "application/json; charset=UTF-8"
                    }
                })
                const products =await response.json();
                products.forEach(product => {
                  product.platformId = platform.platform_id;
                });
                // console.log(products);
                allProduct = [...products,...allProduct];
            }
          }))
          await redisClient.setEx("allProducts",DEFAULTEXP,JSON.stringify(allProduct))
          console.log(allProduct)
          res.send(allProduct);
        }
        catch(err){
          console.log(err);
        }
      }
        
    }
    catch(err){
        console.log(err);
        res.send(err)
    }
}

async function placeOrder(req,res){
    try{
        const platform =await Ecommerce.findOne({platform_id:req.body.platformId});
        const domain = platform.domain;
        const route = platform.placeOrder;
        const user = await User.findById(platform.platform_id);
        const token = user.token
        console.log(domain, route);
        const response = await fetch(domain+route, {
            method: "POST",
            body: JSON.stringify({
              productId: req.body.productId,
              name: req.body.name,
              phone: req.body.phone,
              address: req.body.address
            }),
            headers: {
              "Authorization": "Bearer "+token,
              "Content-type": "application/json; charset=UTF-8"
            }
          })
        const order = await response.json();
        res.send(order);
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
}

async function cancelOrder(req,res){
    try{
        const platform =await Ecommerce.findOne({platform_id:req.body.platformId});
        const domain = platform.domain;
        const route = platform.cancelOrder;
        const user = await User.findById(platform.platform_id);
        const token = user.token
        const response = await fetch(domain+route, {
            method: "PUT",
            body: JSON.stringify({
              itemId: req.body.itemId,
            }),
            headers: {
              "Authorization": "Bearer "+token,
              "Content-type": "application/json; charset=UTF-8"
            }
          })
        const order = await response.json();
        res.send(order);
    }
    catch(err){
        console.log(err);
        res.send(err)
    }
}

async function getReview(req,res){
    try{
        const platform =await Ecommerce.findOne({platform_id:req.body.platformId});
        const domain = platform.domain;
        const route = platform.getReview;
        const user = await User.findById(platform.platform_id);
        const token = user.token
        console.log(req.params);
        const url = domain+route+'/'+req.body.productId;
        console.log(url);
        const response = await fetch(url, {
            method: "GET",         
            headers: {
              "Authorization": "Bearer "+token,
              "Content-type": "application/json; charset=UTF-8"
            }
          })
          const reviews=await response.json();
          res.send(reviews);
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
}

async function addReview(req,res){
    try{
        const platform =await Ecommerce.findOne({platform_id:req.body.platformId});
        const user=await User.findById(req.body.UserId)
        const token = user.token;
        const domain = platform.domain;
        const route = platform.getReview;
        console.log(domain,route);
        const response = await fetch(domain+route, {
            method: "POST",
            body: JSON.stringify({
              productId: req.body.productId,
              rating: req.body.rating,
              review:req.body.review,
              userName: req.body.name
            }),
            headers: {
              "Authorization": "Bearer "+token,
              "Content-type": "application/json; charset=UTF-8"
            }
          })
          const review=await response.json();
          res.send(review);
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
}

module.exports = {
    searchProduct,
    placeOrder,
    cancelOrder,
    getReview,
    addReview
}