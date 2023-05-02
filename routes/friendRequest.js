var express = require("express");
var router = express.Router();
const passport = require("passport");
const { getUserData } = require("../middleware");

var friendRequestController = require("../controllers/friendRequestController");

require("../authStrategy");

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

router.patch(
  "/friend-requests/:id",
  passport.authenticate("jwt", { session: false }),
  friendRequestController.respond_friend_request
);

module.exports = router;
