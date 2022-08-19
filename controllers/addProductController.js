const express = require('express');
const addProductRouter = express.Router();
const AddProduct = require('../mongo/schema/addProduct');


addProductRouter.get('/', async(req, res) => {
   const allcreated = await AddProduct.find();
   res.json(allcreated);
})

addProductRouter.get('/:id', async(req, res) => {
  const id = req.params.id; 
  AddProduct.findById(id, {}, {} , (error, addProduct) => {

     if(error){
         res.status(500).json({error: error.message});
     }else if(!addProduct){
         res.status(404).send();
     }else {
         res.json(addProduct);
     }
 }); 
});

addProductRouter.post("/", async(req, res) => {

    const data = req.body;
    const dataPosted = {
     type: data.type,
     price: data.price,
     description: data.description,
     title: data.title,
     format:data.format,
     thumbnailUrl: data.thumbnailUrl
    }
    
   const newProduct = new AddProduct(dataPosted);

   await newProduct.save()

   console.log('Creating new Product');

   res.json({Message: "Your new Product was created Succesfully", newProduct});
});


addProductRouter.delete('/:id', (req, res) => {
   const id = req.params.id;
   AddProduct.findByIdAndDelete(id, {}, (error, result) =>{
    if(error){
        res.status(500).json({error: error.message});
    }else if(!result){
        res.status(404);
    }else{
        res.status(204).send();
    }
    
})

})

 
addProductRouter.patch ('/:id', async(req, res) => {
   const id = req.params.id;
   const data = req.body;
 
   const updatedProduct = {
      id: id,
      name: data.name,
      description: data.description,
      url:data.url,
      thumbnailUrl:data.thumbnailUrl,
      largeImg:data.largeImg,
      price: data.price
   };
 
   res.json({message: "Your Product has been updated Succesfully", updatedProduct})
 })

module.exports = addProductRouter;