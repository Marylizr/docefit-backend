const express = require('express');
const blogRouter = express.Router();
const Blog = require('../mongo/schema/blog');
const User = require('../mongo/schema/user');


blogRouter.get('/', async(req, res) => {
   const allBlogs = await Blog.find();
   res.json(allBlogs);
  
})

blogRouter.get("/:id", (req, res) => {
   const id = req.params.id;
   Blog.findById(id, {}, {} , (error, blog) => {

       if(error){
           res.status(500).json({error: error.message});
       }else if(!blog){
           res.status(404).send();
       }else {
           res.json(blog);
       }
   });

})


blogRouter.post("/", async(req, res) => {
   
   const body = req.body; 

   const newBlog = new Blog(body); 

   await newBlog.save()  

   const userId = body.author; 

   const user = await User.findById(userId); 

   user.blog.push(newBlog); 

   await user.save ();


   res.json({Message: "Your new Blog was created Succesfully", newBlog});
});

blogRouter.delete("/:id", async(req, res) => {
   const id = req.params.id;

    Blog.findByIdAndDelete(id, {}, (error, result) =>{
        if(error){
            res.status(500).json({error: error.message});
        }else if(!result){
            res.status(404);
        }else{
            res.status(204).send();
        }
    })
 
 })


 blogRouter.patch ('/:id', async(req, res) => {
   const id = req.params.id;
   const body = req.body;
 
   Blog.findByIdAndUpdate(id, body, {new: true}, (error, patchedBlog) => {
      if(error){
          res.status(500).json({error: error.message});
      }else if(!patchedBlog){
          res.status(404).send();
      }else{
          res.json(patchedBlog);
      }
  })

 })


module.exports = blogRouter;