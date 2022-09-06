const express = require('express');
const userRouter = express.Router();
const User = require('../mongo/schema/user');
const {validationResult} = require("express-validator");
const {authMiddleware} = require('../auth/authMiddleware')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



userRouter.get('/',  async(req, res) => {
   const allUsers = await User.find();
   res.json(allUsers)
});

userRouter.get('/me',  async(req, res) => {
    const oneUser = await User.findOne();
    res.json(oneUser)
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

  const { name, lastName, email, password} = req.body;
  const existingUser = await User.findOne( { email: email })

  if(existingUser) {
    res.status(409).json({Message:"Username already in use"})
  } 

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json(errors);
  }
  const genSalt = 10;
  const passwordHashed = bcrypt.hashSync(password, genSalt);

  const newUser = new User ({
    name: name,
    lastName: lastName,
    email: email,
    password: passwordHashed
  });
  const userSaved = await newUser.save();

  const token = jwt.sign({ id: userSaved._id }, process.env.JWT_SECRET, {expiresIn: '1h' });
  return res.status(201).json({ token: token, id: userSaved._id  });
  
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
     name: data.name,
     lastName: data.lastName,
     email: data.email,
     password: data.password
   };
 
   res.json({message: "Your user has been updated Succesfully", updatedUser})
 })

module.exports = userRouter;