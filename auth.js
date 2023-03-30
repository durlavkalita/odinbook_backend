const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const secretOrKey = process.env.SECRET || "secretKey";

// login strategy
passport.use(
  "login",
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    // Find user in database by username
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      // Check if password is correct
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        // If authentication is successful, return user object
        return done(null, user);
      });
    });
  })
);

// jwt strategy
passport.use(
  "jwt",
  new JWTStrategy(
    {
      secretOrKey: secretOrKey,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (jwtPayload, done) => {
      User.findById(jwtPayload.user, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          // If user exists, return user object
          return done(null, user);
        } else {
          // If user doesn't exist, return false
          return done(null, false);
        }
      });
    }
  )
);
