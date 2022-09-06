const { Schema, model } = require('mongoose');


const userSchema = new Schema({
   name: String,
   lastName: String,
   email: String,
   password: String,
});

const User = model ('user', userSchema);

module.exports = User;