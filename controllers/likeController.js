var Post = require('../models/Post');
var Like = require('../models/Like')

exports.like_create = function(req,res,next) {
    try {
        const post = await Post.findById(req.params.postid);
        if(!post) {
          return res.status(404).json({err: "Post not found"});
        }
        var like = new Like(
            {
              author: req.locals.username,
              post: req.params.postid
            }
          );
          like.save(err=>{
            if(err) {return next(err);}
            res.status(200).json({message: "Post liked"})
          });
      } catch (error) {
        next(error);
    }
}