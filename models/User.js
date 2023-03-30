const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "firstName is required."],
  },
  lastName: {
    type: String,
    required: [true, "lastName is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Enter a valid password."],
  },
  profile_pic: {
    type: String,
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", function (next) {
  const user = this;

  // only hash the password if it has been modified or is new
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the plaintext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
