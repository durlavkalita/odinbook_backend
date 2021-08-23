var express = require('express');
var router = express.Router();

// import the controllers
var user_controller = require('../controllers/userController');
var post_controller = require('../controllers/postController');
var comment_controller = require('../controllers/commentController');
var friend_controller = require('../controllers/friendController');


// user routes //
// POST user register
router.post('/register', user_controller.register);     // done
// POST user login
router.post('/login', user_controller.login);   // done
// GET user logout
router.get('/logout', verifyToken, user_controller.logout); 
// GET all user list
router.get('/users', verifyToken, user_controller.all_users);    // done
// GET single user
router.get('/users/:userid', verifyToken, user_controller.single_user);  // done
// DELETE user
router.delete('/users/:userid', verifyToken, user_controller.delete_user);   // done

// post routes //
// POST create new post
router.post('/posts', verifyToken, post_controller.post_create);    //done
// GET all friends posts
router.get('/posts', verifyToken, post_controller.timeline_posts);  //done
// GET all single user posts
router.get('/users/:userid/posts', verifyToken, post_controller.single_user_posts); //done
// GET single post
router.get('/posts/:postid', verifyToken, post_controller.single_post); //done
// DELETE post
router.delete('/posts/:postid', verifyToken, post_controller.delete_post);  //done
// POST like post
router.post('/posts/:postid/like', verifyToken, post_controller.like_post); //done


// comment routes //
// POST create new comment
router.post('/posts/:postid/comments', verifyToken, comment_controller.comment_create); //done
// GET all comments of post
router.get('/posts/:postid/comments', verifyToken, comment_controller.single_post_comments);    //done


// friend routes //
// POST send friend request
router.post('/user/:userid/friend', verifyToken, friend_controller.friend_create);
// GET all friend requests
router.get('/user/:userid/friend', verifyToken, friend_controller.friend_request_list);
// POST friend request answer
router.post('/friend/:friendid/response', verifyToken, friend_controller.friend_request_response);

function verifyToken(req,res,next) {
    // get auth header value
    const bearerHeader = req.headers['authorization'];
    // check if bearer is indefined
    if(typeof bearerHeader !== 'undefined') {
        // split at the space
        const bearer = bearerHeader.split(' ');
        // get token from array
        const bearerToken = bearer[1];
        // set the token
        req.token = bearerToken;
        next();
    } else {
        // forbidden
        res.status(403).json({msg: "no token"});
    }
}

module.exports = router;
