const express = require('express');
const cartRouter = express.Router();
const Cart = require('../mongo/schema/cart');


cartRouter.get('/', async(req, res) => {
   const allfavs = await Cart.find();
   res.json(allfavs);
})

cartRouter.get('/:id', async(req, res) => {
  const id = req.params.id; 
  Cart.findById(id, {}, {} , (error, cart) => {

     if(error){
         res.status(500).json({error: error.message});
     }else if(!cart){
         res.status(404).send();
     }else {
         res.json(cart);
     }
 }); 
});

cartRouter.post("/", async(req, res) => {

   const data = req.body;
   const dataPosted = {
    type: data.type,
    price: data.price,
    description: data.description,
    title: data.title,
    format:data.format,
    thumbnailUrl: data.thumbnailUrl
   }

   const cartProduct = new Cart(dataPosted);

   await cartProduct.save()

   console.log('Saving your product in cart');

   res.status(201).json(cartProduct);
});


cartRouter.delete('/:id', (req, res) => {
   const id = req.params.id;
   Cart.findByIdAndDelete(id, {}, (error, result) =>{
      if(error){
         res.status(500).json({error: error.message});
      }else if(!result){
         res.status(404);
      }else{
         res.status(204).send();
      }
   })
})

 
cartRouter.patch ('/:id', async(req, res) => {
   const id = req.params.id;

   const data = req.body;
   const dataUpdated = {
      id: id,
    type: data.type,
    price: data.price,
    description: data.description,
    title: data.title,
    format:data.format,
    thumbnailUrl: data.thumbnailUrl
   }
 
   res.json({message: "Your Cart has been updated Succesfully", dataUpdated})
 })

module.exports = cartRouter;