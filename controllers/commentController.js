var Comment = require('../models/Comment');
var Post = require('../models/Post');
const {body, validationResult} = require('express-validator');

exports.comment_create = [
  body('content', 'Enter comment content').trim().isLength({min:1}).escape(),
  async (req,res,next)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.status(401).json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    }
    else {
      const post = await Post.findById(req.params.postid);
      if(!post) {
        return res.status(404).json({err: "Post not found"});
      }
      var comment = new Comment(
        {
          content: req.body.content,
          author: req.body.author,
          post: req.params.postid
        }
      );
      comment.save(error => {
          if(error){return next(error);}
          res.status(200).json({message: "Comment Created"})
      });
    }
  }
]

  
exports.single_post_comments = async (req,res,next) => {
  try {
    const post = await Post.findById(req.params.postid);
    if(!post) {
      return res.status(404).json({err: "Post not found"});
    }
    const comments = await Comment.find({post: post});
    if(!comments) {
      return res.status(404).json({err: "No comments not found"});
    }
    res.status(200).json({comments});
  } catch (error) {
    next(error);
  }
} 