const express = require('express');
const User = require('../mongo/schema/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { roles } = require('../roles');


 exports.signup = async (req, res, next) => {
    try {
      const { email, password, role } = req.body
      const hashedPassword = await hashPassword(password);
      const newUser = new User({ email, password: hashedPassword, role: role || "basic" });
      const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });
    newUser.accessToken = accessToken;
      await newUser.save();
      res.json({
        data: newUser,
        accessToken
    })
    } catch (error) {
      next(error)
    }
 }

exports.delete = (req,res) => {
    const id = req.params.id;
  
    User.deleteOne({_id: id}, function (err) {
      if (err) return handleError(err);
  });
  
  const deletedUser = req.body;
    res.status(201).json({Message: "Your User was deleted Succesfully",deletedUser});
};
 
exports.update = async (req,res) => {
  const user = req.sessionUser;
  const id = user._id
  const data = req.body;

  savedUser = await User.find({_id:id});


  if (data.password && data.password.length>0 && data.password !== savedUser[0].password) {
    const genSalt = 10;
    const passwordHashed = bcrypt.hashSync(data.password, genSalt);
    data.password=passwordHashed;
  } 
  
  else {
    data.password = savedUser.password;
  }


  const contacts = await Contact.find({contact_email: user.email})
  contacts.forEach(contact => {
    if(contact.contact_name !== (data.name + " " + data.surname)) contact.contact_name = (data.name + " " + data.surname);
    if(contact.contact_email !== data.email) contact.contact_email = data.email;
    if(contact.contact_img !== data.image) contact.contact_img = data.image;
    contact.save();
  });
  
  const updatedUser = await User.findOneAndUpdate({_id: id},data)
  return res.status(200).json({ message: "Your user has been updated succesfully", updatedUser});
};

exports.login = async (req, res, next) => {
  try {
   const { email, password } = req.body;
   const user = await User.findOne({ email });
   if (!user) return next(new Error('Email does not exist'));
   const validPassword = await validatePassword(password, user.password);
   if (!validPassword) return next(new Error('Password is not correct'))
   const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d"
   });
   await User.findByIdAndUpdate(user._id, { accessToken })
   res.status(200).json({
    data: { email: user.email, role: user.role },
    accessToken
   })
  } catch (error) {
   next(error);
  }
 }

 exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
   data: users
  });
 }
  
 exports.getUser = async (req, res, next) => {
  try {
   const userId = req.params.userId;
   const user = await User.findById(userId);
   if (!user) return next(new Error('User does not exist'));
    res.status(200).json({
    data: user
   });
  } catch (error) {
   next(error)
  }
 }
  
 exports.updateUser = async (req, res, next) => {
  try {
   const update = req.body
   const userId = req.params.userId;
   await User.findByIdAndUpdate(userId, update);
   const user = await User.findById(userId)
   res.status(200).json({
    data: user,
    message: 'User has been updated'
   });
  } catch (error) {
   next(error)
  }
 }
  
 exports.deleteUser = async (req, res, next) => {
  try {
   const userId = req.params.userId;
   await User.findByIdAndDelete(userId);
   res.status(200).json({
    data: null,
    message: 'User has been deleted'
   });
  } catch (error) {
   next(error)
  }
 }


 
exports.grantAccess = function(action, resource) {
 return async (req, res, next) => {
  try {
   const permission = roles.can(req.user.role)[action](resource);
   if (!permission.granted) {
    return res.status(401).json({
     error: "You don't have enough permission to perform this action"
    });
   }
   next()
  } catch (error) {
   next(error)
  }
 }
}
 
exports.allowIfLoggedin = async (req, res, next) => {
 try {
  const user = res.locals.loggedInUser;
  if (!user)
   return res.status(401).json({
    error: "You need to be logged in to access this route"
   });
   req.user = user;
   next();
  } catch (error) {
   next(error);
  }
}