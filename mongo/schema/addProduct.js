const { Schema, model } = require('mongoose');


const addProductSchema = new Schema({ 
   type: String,
   price: String,
   description: String,
   title: String,
   format: String,
   thumbnailUrl:String,
   // author: {
   //    type: Schema.Types.ObjectId,
   //    ref: 'user',
   //    required: true,
   //  },
   // date: { type: Date, default: Date.now },
});

const AddProduct = model ('addProduct', addProductSchema);

module.exports = AddProduct;