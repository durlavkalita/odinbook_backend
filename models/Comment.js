const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema(
    {
        content: {
            type: String,
            required: [true, 'Comment must have content.']
        },
        author: { type: Schema.Types.ObjectId, ref:'User', required: true },
        post: { type: Schema.Types.ObjectId, ref:'Post', required: true },
        created_at: { type: Date, default: Date.now }
    }
);

CommentSchema
.virtual('url')
.get(function() {
    return '/comment/' + this._id;
})

module.exports = mongoose.model('Comment', CommentSchema);