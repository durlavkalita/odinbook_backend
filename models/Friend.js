const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FriendSchema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, ref:'User' },
        reciever: { type: Schema.Types.ObjectId, ref:'User' },
        response: { type: boolean }
    }
);

// FriendSchema
// .virtual('url')
// .get(function() {
//     return '/friend/' + this._id;
// })

module.exports = mongoose.model('Friend', FriendSchema);