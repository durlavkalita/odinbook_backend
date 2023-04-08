var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passport = require("passport");
require("../authStrategy");

const secretOrKey = process.env.SECRET || "secretKey";

router.post("/register", (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  User.findOne({ email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User({ firstName, lastName, email, password });

    user.save((err) => {
      if (err) {
        return res.status(400).json({ error: "Registration failed" });
      }

      const token = jwt.sign({ user: user.id }, secretOrKey, {
        expiresIn: "1d",
      });

      res.json({ token });
    });
  });
});

// router.post("/login", (req, res, next) => {
//   const { email, password } = req.body;

//   User.findOne({ email }, (err, user) => {
//     if (err || !user) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     user.comparePassword(password, (err, isMatch) => {
//       if (err || !isMatch) {
//         return res.status(401).json({ error: "Invalid credentials" });
//       }

//       const token = jwt.sign({ userId: user.id }, secretOrKey, {
//         expiresIn: "1d",
//       });
//       const { id, email, firstName, lastName } = user;

//       res.json({ token, user: { id, email, firstName, lastName } });
//     });
//   });
// });

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  (req, res) => {
    const token = jwt.sign({ user: req.user.id }, secretOrKey, {
      expiresIn: "1d",
    });
    const { id, email, firstName, lastName } = req.user;
    return res.json({ token, user: { id, email, firstName, lastName } });
  }
);
module.exports = router;
