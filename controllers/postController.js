const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

exports.get_posts_list = async (req, res, next) => {
  try {
    const { page = 1, perPage = 3 } = req.query;
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);
    const posts = await Post.find()
      .populate("author", "id firstName lastName email profile_pic")
      .populate("liked_by", "id")
      .sort({ created_at: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const postsWithComments = [];

    for (const post of posts) {
      const comments = await Comment.find({ post: post._id }).populate(
        "author",
        "id firstName lastName"
      );
      postsWithComments.push({ ...post._doc, comments });
    }

    res.json({ posts: postsWithComments, currentPage: page, totalPages });
  } catch (error) {
    next(error);
  }
};

exports.get_timeline_posts_list = async (req, res, next) => {
  try {
    const current_user = req.user;
    const timeline_users = [...current_user.friends, current_user._id];

    const { page = 1, perPage = 3 } = req.query;
    const posts = await Post.find({ author: { $in: timeline_users } })
      .populate("author", "id firstName lastName email profile_pic")
      .populate("liked_by", "id")
      .sort({ created_at: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / perPage);

    const postsWithComments = [];

    for (const post of posts) {
      const comments = await Comment.find({ post: post._id }).populate(
        "author",
        "id firstName lastName"
      );
      postsWithComments.push({ ...post._doc, comments });
    }

    res.json({ posts: postsWithComments, currentPage: page, totalPages });
  } catch (error) {
    next(error);
  }
};

exports.get_post = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "id firstName lastName email profile_pic")
      .populate("liked_by", "id");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const comments = await Comment.find({ post: post._id });
    postWithComments = { ...post._doc, comments };
    return res.status(200).json(postWithComments);
  } catch (error) {
    next(error);
  }
};

exports.create_post = [
  body("content", "Enter post content").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
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
      const authorDetails = await User.findById(req.user.id);
      post.save((error) => {
        if (error) {
          return next(error);
        }
      });
      post.author = authorDetails;
      return res.status(200).json(post);
    }
  },
];

exports.update_post = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (req.user.id != post.author) {
      return res.json(404).json({ error: "You cannot modify this post" });
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
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (req.user.id != post.author) {
      return res.json(404).json({ error: "You cannot delete this post" });
    }
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    return res.status(204).json(deletedPost);
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
    console.log(post);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.json(post);
  } catch (err) {
    next(error);
    // return res.status(500).json({ error: "Server error" });
  }
};
exports.toggle_like_post = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const likedIndex = post.liked_by.indexOf(userId);

    if (likedIndex === -1) {
      // user has not liked post yet
      post.liked_by.push(userId);
    } else {
      // user has already liked post, remove like
      post.liked_by.splice(likedIndex, 1);
    }

    await post.save();

    return res.status(200).json({ success: true, post });
  } catch (error) {
    return next(error);
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
