const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

require("dotenv").config();

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testUser = {
  firstName: "Test",
  lastName: "User",
  email: "test@test.com",
  password: "password",
  profile_pic: "https://i.pravatar.cc/150?u=test@test.com",
};
bcrypt.genSalt(10, function (err, salt) {
  if (err) return next(err);

  // hash the password along with our new salt
  bcrypt.hash(testUser.password, salt, function (err, hash) {
    if (err) return next(err);

    // override the plaintext password with the hashed one
    testUser.password = hash;
  });
});

const users = [];
users.push(testUser);

for (let i = 0; i < 9; i++) {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email();
  const password = faker.internet.password();
  const profile_pic = `https://i.pravatar.cc/150?u=${email}`;
  const user = new User({
    firstName,
    lastName,
    email,
    password,
    profile_pic,
  });
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the plaintext password with the hashed one
      user.password = hash;
    });
  });
  users.push(user);
}

async function populateUserDb() {
  try {
    await User.deleteMany({});

    await User.insertMany(users);

    console.log("User database populated successfully!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

populateUserDb();
