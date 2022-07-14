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

    const {name, title, description, url, thumbnailUrl, largeImg } = req.body;
    const data = {
     name,
     title,
     description,
     url,
     thumbnailUrl,
     largeImg,
    }
    
   const newProduct = new AddProduct(data);

   await newProduct.save()

   console.log('Creating new Product');

   res.json({Message: "Your new PokeWiki was created Succesfully", newProduct});
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

 
AddProduct.patch ('/:id', async(req, res) => {
   const id = req.params.id;
   const data = req.body;
 
   const updatedProduct = {
     id: id,
     email: data.email,
     name: data.name,
     description: data.description,
   };
 
   res.json({message: "Your PokeWiki has been updated Succesfully", updatedProduct})
 })

module.exports = addProductRouter;