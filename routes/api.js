var express = require('express');
var router = express.Router();

// import the controllers
var post_controller = require('../controllers/postController');
var comment_controller = require('../controllers/commentController');
var friend_controller = require('../controllers/friendController');

require('../config/auth');

// post routes //
// POST create new post
router.post('/posts', post_controller.post_create);    //done
// GET all friends posts
router.get('/posts', post_controller.timeline_posts);  //done
// GET all single user posts
router.get('/users/:userid/posts', post_controller.single_user_posts); //done
// GET single post
router.get('/posts/:postid', post_controller.single_post); //done
// DELETE post
// router.delete('/posts/:postid', post_controller.delete_post);  //
// POST like post
router.post('/posts/:postid/like', post_controller.like_post); //done


// comment routes //
// POST create new comment
router.post('/posts/:postid/comments', comment_controller.comment_create); //done
// GET all comments of post
router.get('/posts/:postid/comments', comment_controller.single_post_comments);    //done


// friend routes //
// POST send friend request
router.post('/user/:userid/friend', friend_controller.friend_create);
// GET all friend requests
router.get('/user/:userid/friend', friend_controller.friend_request_list);
// POST friend request answer
router.post('/friend/:friendid/response', friend_controller.friend_request_response);

module.exports = router;
