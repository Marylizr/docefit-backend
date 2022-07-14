const { Schema, model } = require('mongoose');


const addProductSchema = new Schema({ 
   name: String,
   description: String,
   url:String,
   thumbnailUrl:String,
   largeImg:String,
});

const AddProduct = model ('addProduct', addProductSchema);

module.exports = AddProduct;