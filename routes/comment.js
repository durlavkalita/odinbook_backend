var express = require("express");
var router = express.Router();
var passport = require("passport");
const { getUserData } = require("../middleware");

var commentController = require("../controllers/commentController");

require("../authStrategy");

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  commentController.update_comment
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  commentController.delete_comment
);
module.exports = router;
