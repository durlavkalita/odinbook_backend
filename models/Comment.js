const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  content: {
    type: String,
    required: [true, "Content must not be empty"],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
