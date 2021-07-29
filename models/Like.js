const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LikeSchema = new Schema(
    {
        author: { type: Schema.Types.ObjectId, ref:'User' },
        post: { type: Schema.Types.ObjectId, ref:'Post' },
    }
);

// LikeSchema
// .virtual('url')
// .get(function() {
//     return '/like/' + this._id;
// })

module.exports = mongoose.model('Like', LikeSchema);