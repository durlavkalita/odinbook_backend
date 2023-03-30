var FriendRequest = require("../models/FriendRequest");
var User = require("../models/User");

exports.friend_requests_list = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const friend_requests = await FriendRequest.find({ recipient: userId });
    if (!friend_requests) {
      return res.status(404).json({ error: "No requests found" });
    }
    return res.status(200).json(friend_requests);
  } catch (error) {
    next(error);
  }
};

exports.friend_requests_sent_list = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const friend_requests = await FriendRequest.find({ sender: userId });
    if (!friend_requests) {
      return res.status(404).json({ error: "No requests found" });
    }
    return res.status(200).json(friend_requests);
  } catch (error) {
    next(error);
  }
};

exports.get_friend_request = async (req, res, next) => {
  try {
    const friend_request = await FriendRequest.findById(req.params.id);
    if (!friend_request) {
      return res.status(404).json({ error: "Request not found" });
    }
    return res.status(200).json(friend_request);
  } catch (error) {
    next(error);
  }
};

exports.send_friend_request = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const recipient = await User.findById(userId);

    if (!recipient) {
      return res.status(404).json({ error: "User not found" });
    }
    if (recipient.id == req.user.id) {
      return res
        .status(404)
        .json({ error: "Cannot send friend request to self" });
    }

    // Create a new friend request
    const friendRequest = new FriendRequest({
      sender: req.user.id,
      recipient: recipient.id,
    });

    await friendRequest.save();

    res.json(friendRequest);
  } catch (err) {
    console.error(err);
    next(error);
  }
};

exports.respond_friend_request = async (req, res, next) => {
  const friendRequestId = req.params.id;
  const { action } = req.body;

  try {
    let friendRequest = await FriendRequest.findById(friendRequestId);

    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    // Only the recipient of the friend request can respond to it
    if (!friendRequest.recipient.equals(req.user._id)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Accept or decline the friend request
    if (action === "accepted") {
      // Add the sender to the recipient's friends list
      await User.findByIdAndUpdate(friendRequest.recipient, {
        $addToSet: { friends: friendRequest.sender },
      });

      // Add the recipient to the sender's friends list
      await User.findByIdAndUpdate(friendRequest.sender, {
        $addToSet: { friends: friendRequest.recipient },
      });
    }

    // Delete the friend request
    await FriendRequest.findByIdAndDelete(friendRequestId);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
