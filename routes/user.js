var express = require('express');
var router = express.Router();
var passport = require('passport');

var user_controller = require('../controllers/userController');

require('../config/auth');

// user routes //
// POST user register
router.post('/register', user_controller.register);     // done
// POST user login
router.post('/login', user_controller.login);   // done
// GET user logout
router.get('/logout', passport.authenticate('jwt', { session: false }), user_controller.logout);  // done
// GET all user list
router.get('/users',  user_controller.all_users);    // done
// GET single user
router.get('/users/:userid', passport.authenticate('jwt', { session: false }), user_controller.single_user);  // done
// GET single user posts
router.get('/users/:userid/posts', passport.authenticate('jwt', { session: false }), user_controller.single_user_posts);  // done
// DELETE user
// router.delete('/users/:userid', user_controller.delete_user);   // done

module.exports = router;