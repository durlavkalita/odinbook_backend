const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const User = require("../models/User");
const Post = require("../models/Post");

require("dotenv").config();

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const posts = [];

async function populatePostDb() {
  try {
    await Post.deleteMany({});

    const users = await User.find();
    for (let i = 0; i < 20; i++) {
      const content = faker.lorem.paragraphs(1);
      const author = users[getRandomInt(0, users.length - 1)]._id;
      const post = new Post({
        content,
        author,
      });
      posts.push(post);
    }

    await Post.insertMany(posts);
    console.log("Post database populated successfully");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

populatePostDb();
