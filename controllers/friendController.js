var Friend = require('../models/Friend');
var User = require('../models/User');

exports.friend_create = async (req,res,next) => {
    try {
        const user = await User.findById(req.params.userid);
        if(!user) {
          return res.status(404).json({err: "User not found"});
        }
        if(req.body.author == req.params.userid) {
          return res.status(404).json({msg: "can't send friend request to yourself"});
        }
        if (user.friends.includes(req.body.author)) {
          return res.status(404).json({msg: "already friends"});
        }
        var friend = new Friend(
            {
              sender: req.body.author,
              reciever: req.params.userid,
            }
          );
          friend.save(err=>{
            if(err) {return next(err);}
            res.status(200).json({message: "Friend request sent"})
          });
      } catch (error) {
        next(error);
    }
}

exports.friend_request_list = async (req,res,next) => {
  try {
    const requests = await Friend.find({"reciever": req.params.userid});
    if(!requests) {
      return res.status(404).json({err: "Could not found"});
    }
    res.status(200).json({requests});
  } catch (error) {
    next(error);
  }
}

exports.friend_request_response = async (req,res,next) => {
  try {
    const request = await Friend.findById(req.params.friendid);
    if(!request) {
      return res.status(404).json({error: "invalid request"})
    }
    if(req.body.response == true) {
      const user1 = await User.findByIdAndUpdate(request.sender, 
        {$push: {"friends": request.reciever}},
        {safe: true, upsert: true, new : true},
        function(err, model) {
            console.log(err);
        }
      );
      const user2 = await User.findByIdAndUpdate(request.reciever, 
        {$push: {"friends": request.sender}},
        {safe: true, upsert: true, new : true},
        function(err, model) {
            console.log(err);
        }
      );
      res.status(200).json({message: "Friend added"});
    }
    else {
      try {
        await Friend.findByIdAndRemove(req.params.friendid, function(err){
            if(err) {next(err);}
            res.status(200).json({msg: "request deleted"});
        });
      } catch (error) {
          next(error);
      }
    }
  } catch (error) {
    next(error);
  }
}