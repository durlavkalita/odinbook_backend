var Post = require('../models/Post');
var User = require('../models/User');
const {body, validationResult} = require('express-validator');


// POST create new post
exports.create_post = [
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
                    author: req.body.author,
                }
            );
            if(req.body.image) {
                post.image = req.body.image
            }
            post.save(error => {
                if(error){return next(error);}
                res.status(200).json({message: "Post Created"})
            });
        }
    }
]

// GET all friends posts
exports.get_posts = async (req,res,next) => {
    try {
        const user = await User.findById(req.params.userid);
        var timelineAuthors = user.friends;
        timelineAuthors.push(req.params.userid);
        var posts = await Post.find({author: timelineAuthors}).sort({created_at:-1});
        if(!posts) {
            return res.status(404).json({error: "No posts found"});
        }
        res.status(200).json(posts)
    } catch (error) {
        next(error);
    }
}

// GET user name
exports.get_user_name = async (req,res,next) => {
    try {
        const user = await User.findById(req.params.userid);
        if(!user) {
            return res.status(404).json({error: "User not found"});
        }
        const name = user.firstName + " " + user.lastName;
        res.status(200).json(name);
    } catch (error) {
        next(error)
    }
}

// DELETE post
exports.delete_post = async (req,res,next) => {
    try {
        await Post.findByIdAndRemove(req.params.id, function(err){
            if(err) {next(err);}
            res.status(200).json({msg: "post deleted"});
        });
    } catch (error) {
        next(error);
    }
}

// POST like post
exports.like_post = async (req,res,next) => {
    try {
        const post = await Post.findById(req.params.postid);
        if(post.likes.includes(req.body.author)) {
            await Post.findByIdAndUpdate(req.params.postid, 
                {$pull: {"likes": req.body.author}},
                {safe: true, new : true},
                function(err, model) {
                    console.log(err);
                }
            );
            res.status(204).json({message: "Post unliked"});
        } else {
            await Post.findByIdAndUpdate(req.params.postid, 
                {$addToSet: {"likes": req.body.author}},
                {safe: true, new : true},
                function(err, model) {
                    console.log(err);
                }
            );
            res.status(200).json({message: "Post liked"});
        }
        if(!post) {
            return res.status(404).json({message: "Post not found"});
            }
    } catch (error) {
        next(error);
    }
}