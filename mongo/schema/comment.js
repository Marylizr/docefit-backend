const { Schema, model } = require('mongoose');


const commentSchema = new Schema({
   title: String,
   comment_body: String,
   author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
   date: { type: Date, default: Date.now },
});

const Comment = model ('comment', commentSchema);

module.exports = Comment;