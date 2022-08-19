const express = require('express');
const userRouter = express.Router();
const User = require('../mongo/schema/user');
const {validationResult} = require("express-validator");
const {authMiddleware} = require('../auth/authMiddleware')



userRouter.get('/',  async(req, res) => {
   const allUsers = await User.find().populate('blog');
   res.json(allUsers)
});

userRouter.get('/me',  async(req, res) => {
    const oneUsers = await User.findOne();
    res.json(oneUsers)
 });

userRouter.get('/name/:id', async(req, res) => {
    const nameUser = await User.findOne();
    res.json(nameUser)
 });

userRouter.get('/:id', async(req, res) => {
  const id = req.params.id; 
  User.findById(id, {}, {} , (error, user) => {

     if(error){
         res.status(500).json({error: error.message});
     }else if(!user){
         res.status(404).send();
     }else {
         res.json(user);
     }
 }); 
});

userRouter.post("/", async(req, res) => {

    const {name, lastName, email, password} = req.body;
    
    const existingUser = await User.findOne( { email: email })
 
     if(existingUser) {
       res.status(409).json({Message:"Username already in use"})
     } 
 
     const errors = validationResult(req);
     if(!errors.isEmpty()){
       return res.status(400).json(errors);
     }
   
   
     const newUser = new User ({
       name: name,
       lastName: lastName,
       email: email,
       password: password
     });
     
     const userSaved = await newUser.save();
     return res.status(201).json({ id: userSaved._id  });
     
   });

userRouter.delete('/:id', authMiddleware, async(req, res) => {
   const id = req.params.id;
   User.findByIdAndDelete(id, {}, (error, result) =>{
        if(error){
            res.status(500).json({error: error.message});
        }else if(!result){
            res.status(404);
        }else{
            res.status(204).send();
        }   
    })
})

 
 userRouter.patch ('/:id', authMiddleware, async(req, res) => {
   const id = req.params.id;
   const data = req.body;
 
   const updatedUser = {
     id: id,
     email: data.email,
     name: data.name,
     description: data.description,
   };
 
   res.json({message: "Your user has been updated Succesfully", updatedUser})
 })

module.exports = userRouter;