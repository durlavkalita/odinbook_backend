const Comment = require("../models/Comment");
const Post = require("../models/Post");

const { body, validationResult } = require("express-validator");

exports.create_comment = [
  body("content", "Content cannot be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(401).json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      const comment = new Comment({
        content: req.body.content,
        author: req.user.id,
        post: req.params.id,
      });
      comment.save((error) => {
        if (error) {
          return next(error);
        }
        return res.status(200).json(comment);
      });
    }
  },
];

exports.update_comment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (req.user.id != comment.author) {
      return res.json(404).json({ error: "You cannot modify this comment" });
    }
    if (req.body.content) {
      comment.content = req.body.content;
    }

    const updatedComment = await comment.save();
    res.json(updatedComment);
  } catch (error) {
    next(error);
  }
};

exports.delete_comment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (req.user.id != comment.author) {
      return res.json(404).json({ error: "You cannot delete this comment" });
    }
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    return res.status(204).json(deletedComment);
  } catch (error) {
    next(error);
  }
};
