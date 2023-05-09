const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const FriendRequest = require("../models/FriendRequest");

// const { body, validationResult } = require("express-validator");

exports.get_users_list = async (req, res, next) => {
  try {
    // console.log(req.user.id);
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ error: "No users found" });
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
      .populate("author", "id firstName lastName profile_pic")
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

exports.get_new_people = async (req, res, next) => {
  try {
    // console.log(req.user.id);
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ error: "No users found" });
    }
    const currentUser = req.user;
    const userId = currentUser.id;
    const friendIds = currentUser.friends.map((id) => id.toString());
    const friend_requests_received = await FriendRequest.find({
      recipient: userId,
    }).populate("sender", "id");
    const friend_requests_sent = await FriendRequest.find({
      sender: userId,
    }).populate("recipient", "id");
    var excludeIds = [
      ...friend_requests_received.map((item) => item.sender.id),
      ...friend_requests_sent.map((item) => item.recipient.id),
      userId,
      ...friendIds,
    ];
    filteredUser = users.filter((user) => !excludeIds.includes(user.id));
    return res.status(200).json(filteredUser);
  } catch (error) {
    next(error);
  }
};
