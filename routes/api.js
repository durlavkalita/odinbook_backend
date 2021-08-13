var express = require('express');
var router = express.Router();

// import the controllers
var user_controller = require('../controllers/userController');
var post_controller = require('../controllers/postController');
var comment_controller = require('../controllers/commentController');
var like_controller = require('../controllers/likeController');
var friend_controller = require('../controllers/friendController');


// user routes //
// POST user register
router.post('/user/register', user_controller.register);
// POST user signin
router.post('/user/signin', user_controller.signin);
// GET user signout
router.get('/user/signout', user_controller.signout);


// post routes //
// POST create new post
router.post('/posts', post_controller.post_create);
// GET all friends posts
router.get('/posts', post_controller.timeline_posts);
// GET all single user posts
router.get('/user/:userid/posts', post_controller.single_user_posts);


// comment routes //
// POST create new comment
router.post('/posts/:postid/comments', comment_controller.comment_create);
// GET all comments of post
router.get('/posts/:postid/comments', comment_controller.single_post_comments);


// like routes //
// POST create new like
router.post('/posts/:postid/like', like_controller.like_create);


// friend routes //
// POST send friend request
router.post('/user/:userid/friend', friend_controller.friend_create);

module.exports = router;
