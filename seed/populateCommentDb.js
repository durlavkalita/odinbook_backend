const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

require("dotenv").config();

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const comments = [];

async function populatePostDb() {
  try {
    await Comment.deleteMany({});

    const posts = await Post.find();
    const users = await User.find();

    for (let i = 0; i < posts.length * 2; i++) {
      const content = faker.lorem.sentence();
      const author = users[getRandomInt(0, users.length - 1)]._id;
      const post = posts[getRandomInt(0, posts.length - 1)]._id;
      const comment = new Comment({
        content: content,
        author: author,
        post: post,
      });
      comments.push(comment);
    }

    await Comment.insertMany(comments);
    console.log("Comment database populated successfully");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

populatePostDb();
