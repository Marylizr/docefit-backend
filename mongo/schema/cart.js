const { Schema, model } = require('mongoose');


const cartSchema = new Schema({ 
   type: String,
   price:Number,
   description: String,
   title:String,
   format:String,
   thumbnailUrl:String,
});


const Cart = model ('cart', cartSchema);

module.exports = Cart;