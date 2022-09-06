const { Schema, model } = require('mongoose');


const blogSchema = new Schema({ 
   title: String,
   body: String,
   data: Date
   
});

const Blog = model ('blog', blogSchema);

module.exports = Blog;