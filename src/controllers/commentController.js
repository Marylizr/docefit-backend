const express = require('express');
const commentRouter = express.Router();
const Comment = require('../mongo/schema/comment');


commentRouter.get('/:id', async(req, res) => {
   const id = req.params.id; 
   Comment.findOne().populate('author')(id, {}, {} , (error, comment) => {

      if(error){
          res.status(500).json({error: error.message});
      }else if(!comment){
          res.status(404).send();
      }else {
          res.json(comment);
      }
  }); 
})


commentRouter.get('/', async(req, res) => {

   Comment.findAll().populate('author')( {}, {} , (error, comment) => {

      if(error){
          res.status(500).json({error: error.message});
      } else if(!comment){
          res.status(404).send();
      }else {
          res.json(comment);
      }
  }); 

})

commentRouter.post("/", async(req, res) => {
  
   const body = req.body;
   const comment = new Comment(body);
   comment.save((error, commentSaved ) => {
       if(error){
           res.status(500).json({error: error.message});
       }else{
           res.status(201).json(commentSaved);
       }
   });
});

commentRouter.delete("/:id", async(req, res) => {
   const id = req.params.id;
   Comment.findByIdAndDelete(id, {}, (error, result) =>{
      if(error){
          res.status(500).json({error: error.message});
      }else if(!result){
          res.status(404);
      }else{
          res.status(204).send();
      }   
   })
 })


 commentRouter.patch("/:id", async(req, res) => {
   const body = req.body;
    const id = req.params.id;

    Comment.findByIdAndUpdate(id, body, {new: true}, (error, commentModificado) => {
        if(error){
            res.status(500).json({error: error.message});
        }else if(!commentModificado){
            res.status(404).send();
        }else{
            res.json(commentModificado);
        }
    })
});

module.exports = commentRouter;