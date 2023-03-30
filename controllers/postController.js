const Post = require("../models/Post");

const { body, validationResult } = require("express-validator");

exports.get_posts_list = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ created_at: -1 });
    if (!posts) {
      return res.status(404).json({ error: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

exports.get_post = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

exports.create_post = [
  body("content", "Enter post content").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      var post = new Post({
        content: req.body.content,
        author: req.user.id,
      });
      post.save((error) => {
        if (error) {
          return next(error);
        }
        return res.status(200).json({ message: "Post Created" });
      });
    }
  },
];

exports.update_post = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // update the post fields
    // if (req.body.title) {
    //   post.title = req.body.title;
    // }
    if (req.body.content) {
      post.content = req.body.content;
    }
    // if (req.body.tags) {
    //   post.tags = req.body.tags;
    // }

    // save the updated post
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
};

exports.delete_post = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.status(204).json(post);
  } catch (error) {
    next(error);
  }
};

exports.like_post = async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { liked_by: req.user.id } },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.json(post);
  } catch (err) {
    next(error);
    // return res.status(500).json({ error: "Server error" });
  }
};

exports.unlike_post = async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { liked_by: req.user._id } },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    next(error);
  }
};
