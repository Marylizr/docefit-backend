const { Schema, model } = require('mongoose');


const userSchema = new Schema({
   name: String,
   lastName: String,
   email: String,
   password: String,
   comment: [{ 
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
   }],
});

const User = model ('user', userSchema);

module.exports = User;