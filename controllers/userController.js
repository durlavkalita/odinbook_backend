const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

// const { body, validationResult } = require("express-validator");

exports.get_users_list = async (req, res, next) => {
  try {
    // console.log(req.user.id);
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ error: "No posts found" });
    }
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.get_user = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const posts = await Post.find({ author: user.id })
      .populate("author", "id firstName lastName")
      .populate("liked_by", "id")
      .sort({ created_at: -1 });

    const postsWithComments = [];

    for (const post of posts) {
      const comments = await Comment.find({ post: post._id }).populate(
        "author",
        "id firstName lastName"
      );
      postsWithComments.push({ ...post._doc, comments });
    }
    const userWithPosts = { ...user._doc, postsWithComments };
    return res.status(200).json(userWithPosts);
  } catch (error) {
    next(error);
  }
};

exports.update_user = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    if (req.user.id != user.id) {
      return res.json(404).json({ error: "You cannot modify this data" });
    }
    // update the user fields
    if (req.body.firstName) {
      user.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      user.lastName = req.body.lastName;
    }
    if (req.body.profile_pic) {
      user.profile_pic = req.body.profile_pic;
    }
    console.log(req.body);
    // save the updated user
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};
