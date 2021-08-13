var Comment = require('../models/Comment');
var Post = require('../models/Post');
const {body, validationResult} = require('express-validator');

exports.comment_create = [
  body('content', 'Enter comment content').trim().isLength({min:1}).escape(),
  (req,res,next)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.status(401).json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    }
    else {
      var comment = new Comment(
        {
          body: req.body.content,
          author: req.locals.username,
          post: req.params.postid
        }
      );
      comment.save(err=>{
        if(err) {return next(err);}
        res.status(200).json({message: "Comment created"})
      });
    }
  }
]

  
exports.single_post_comments = function(req,res,next) {
  try {
    const post = await Post.findById(req.params.postid);
    if(!post) {
      return res.status(404).json({err: "Post not found"});
    }
    const comments = post.comments;
    res.status(200).json({comments});
  } catch (error) {
    next(error);
  }
} 