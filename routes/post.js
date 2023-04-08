var express = require("express");
var router = express.Router();
var passport = require("passport");
const { getUserData } = require("../middleware");

var postController = require("../controllers/postController");
var commentController = require("../controllers/commentController");
require("../authStrategy");
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  postController.get_posts_list
);
router.post(
  "/",
  getUserData,
  passport.authenticate("jwt", { session: false }),
  postController.create_post
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  postController.get_post
);
router.patch(
  "/:id",
  getUserData,
  passport.authenticate("jwt", { session: false }),
  postController.update_post
);
router.delete(
  "/:id",
  getUserData,
  passport.authenticate("jwt", { session: false }),
  postController.delete_post
);
// router.patch(
//   "/:id/like",
//   passport.authenticate("jwt", { session: false }),
//   postController.like_post
// );
router.patch(
  "/:id/toggle_like",
  getUserData,
  passport.authenticate("jwt", { session: false }),
  postController.toggle_like_post
);
// router.patch(
//   "/posts/:id/unlike",
//   passport.authenticate("jwt", { session: false }),
//   postController.unlike_post
// );
router.post(
  "/:id/comments",
  getUserData,
  passport.authenticate("jwt", { session: false }),
  commentController.create_comment
);
module.exports = router;
