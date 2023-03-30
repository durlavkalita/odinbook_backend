var express = require("express");
var router = express.Router();
const passport = require("passport");
const { getUserData } = require("../middleware");

var postController = require("../controllers/postController");
var commentController = require("../controllers/commentController");
var friendRequestController = require("../controllers/friendRequestController");
var userController = require("../controllers/userController");

require("../auth");

// userController
router.get(
  "/users",
  getUserData,
  passport.authenticate("jwt", { session: false }),
  userController.get_users_list
);
router.get(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  userController.get_user
);
router.patch(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  userController.update_user
);

// postController
router.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  postController.get_posts_list
);
router.get(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  postController.get_post
);
router.post(
  "/posts",
  getUserData,
  passport.authenticate("jwt", { session: false }),
  postController.create_post
);
router.patch(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  postController.update_post
);
router.delete(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  postController.delete_post
);
router.patch(
  "/posts/:id/like",
  passport.authenticate("jwt", { session: false }),
  postController.like_post
);
router.patch(
  "/posts/:id/unlike",
  passport.authenticate("jwt", { session: false }),
  postController.unlike_post
);

// commentController
router.post(
  "/posts/:id/comments",
  getUserData,
  passport.authenticate("jwt", { session: false }),
  commentController.create_comment
);
router.patch(
  "/comments/:id",
  passport.authenticate("jwt", { session: false }),
  commentController.update_comment
);
router.delete(
  "/comments/:id",
  passport.authenticate("jwt", { session: false }),
  commentController.delete_comment
);

// friendRequestController
router.get(
  "/friend-requests",
  passport.authenticate("jwt", { session: false }),
  friendRequestController.friend_requests_list
);
router.get(
  "/friend-requests-sent",
  passport.authenticate("jwt", { session: false }),
  friendRequestController.friend_requests_sent_list
);
router.get(
  "/friend-requests/:id",
  passport.authenticate("jwt", { session: false }),
  friendRequestController.get_friend_request
);
router.post(
  "/users/:id/friend-requests",
  passport.authenticate("jwt", { session: false }),
  friendRequestController.send_friend_request
);
router.patch(
  "/friend-requests/:id",
  passport.authenticate("jwt", { session: false }),
  friendRequestController.respond_friend_request
);

module.exports = router;
