const { Schema, model } = require('mongoose');


const blogSchema = new Schema({ 
   title: String,
   author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
   body: String,
   data: Date
   
});

const Blog = model ('blog', blogSchema);

module.exports = Blog;