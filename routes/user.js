var express = require("express");
var router = express.Router();
var passport = require("passport");
const { getUserData } = require("../middleware");

var userController = require("../controllers/userController");
var friendRequestController = require("../controllers/friendRequestController");
require("../authStrategy");

router.get(
  "",
  getUserData,
  passport.authenticate("jwt", { session: false }),
  userController.get_users_list
);
router.get(
  "/find-people",
  getUserData,
  passport.authenticate("jwt", { session: false }),
  userController.get_new_people
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userController.get_user
);
router.patch(
  "/:id/update",
  getUserData,
  passport.authenticate("jwt", { session: false }),
  userController.update_user
);
router.post(
  "/:id/friend-requests",
  passport.authenticate("jwt", { session: false }),
  friendRequestController.send_friend_request
);
module.exports = router;
