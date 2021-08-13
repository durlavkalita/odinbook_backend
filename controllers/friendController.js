var Friend = require('../models/Friend');
var User = require('../models/User');

exports.friend_create = function(req,res,next) {
    try {
        const user = await User.findById(req.params.userid);
        if(!user) {
          return res.status(404).json({err: "User not found"});
        }
        var friend = new Friend(
            {
              sender: req.locals.username,
              reciever: req.params.userid,
              response: false
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