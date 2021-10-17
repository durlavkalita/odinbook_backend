var express = require('express');
var router = express.Router();

// import the controllers
var post_controller = require('../controllers/postController');
var comment_controller = require('../controllers/commentController');
var friend_controller = require('../controllers/friendController');

require('../config/auth');

// post routes //
// GET all friends posts
router.get('/posts/:userid/feed', post_controller.get_posts);  //done
// GET name of user
router.get('/user/:userid/name', post_controller.get_user_name);  //done
// POST create new post
router.post('/posts', post_controller.create_post);    //done
// DELETE post
router.delete('/posts/:postid', post_controller.delete_post);  //
// POST like post
router.post('/posts/:postid/like', post_controller.like_post); //done



// comment routes //
// POST create new comment
router.post('/posts/:postid/comments', comment_controller.comment_create); //done
// GET all comments of post
router.get('/posts/:postid/comments', comment_controller.single_post_comments);    //done


// friend routes //
// POST send friend request
router.post('/friends/:userid', friend_controller.friend_create);
// GET all friend requests
router.get('/friends/:userid', friend_controller.friend_request_list);
// POST friend request answer
router.post('/friends/:friendid/response', friend_controller.friend_request_response);

module.exports = router;
