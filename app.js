var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
require('dotenv').config();

passport.use(
    new LocalStrategy(
    function(email, password, done) {
      User.findOne({ email: email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        bcrypt.compare(password, user.password, (err, res) => {
            if(err) throw err;
            if (res) {
                return done(null, user);
            }
            return done(null, false, { msg: 'Incorrect Password' });
        });
      });
    }
));

// passport.use(
//     new JWTStrategy(
//         {
//             jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//             secretOrKey: process.env.SECRET,
//         },

//         function(jwt_payload, done) {
//             User.findOne({id: jwt_payload.id}, function(err, user) {
//                 if (err) {
//                     return done(err, false);
//                 }
//                 if (user) {
//                     return done(null, user);
//                 } else {
//                     return done(null, false);
//                     // or you could create a new account
//                 }
//         });
//     }
//     )
// );

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(passport.initialize());
// app.use(passport.session());

app.use('/', indexRouter);
app.use('/api', apiRouter);
// app.use('/api', passport.authenticate('jwt', {session: false}), user);

module.exports = app;
