var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
var passport = require('passport');
require('dotenv').config();

require('./config/auth');

var apiRouter = require('./routes/api');
var userRouter = require('./routes/user');

var app = express();

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(passport.initialize());

app.use('/api', passport.authenticate('jwt', { session: false }), apiRouter);
app.use('/', userRouter);

module.exports = app;
