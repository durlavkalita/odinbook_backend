var Post = require('../models/Post');
var User = require('../models/User');
const {body, validationResult} = require('express-validator');


// POST create new post
exports.post_create = [
    body('content', 'Enter post content').trim().isLength({min:1}).escape(),
    (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.json({
                data: req.body,
                errors: errors.array(),
            });
            return;
        }
        else {
            var post = new Post(
                {
                    content: req.body.content,
                    author: req.locals.user,
                    post: req.params.postid
                }
            );
            post.save(error => {
                if(error){return next(error);}
                res.status(200).json({message: "Post Created"})
            });
        }
    }
]

// GET all friends posts
exports.timeline_posts = async (req,res,next) => {
    try {
        const posts = await Post.find({}); // getting all posts for now
        if(!posts) {
            return res.status(404).json({error: "No posts found"});
        }
        res.status(200).json({posts});
    } catch (error) {
        next(error);
    }
} 

// GET all single user posts
exports.single_user_posts = async (req,res,next) => {
    try {
        const user = await User.findById(req.params.userid);
        const posts = user.posts;
        if(!posts) {
            return res.status(404).json({error: "No posts found"});
        }
        res.status(200).json({posts});
    } catch (error) {
        next(error);
    }
} 