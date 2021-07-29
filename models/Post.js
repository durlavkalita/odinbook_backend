const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema(
    {
        content: {
            type: String,
            required: [true, 'Post must have content.']
        },
        author: { type: Schema.Types.ObjectId, ref:'User' },
        comments: [{ type: Schema.Types.ObjectId, ref:'Comment' }],
        likes: [{ type: Schema.Types.ObjectId, ref:'Like' }],
    }
);

PostSchema
.virtual('totalLikes')
.get(function() {
    return this.likes.length;
})

PostSchema
.virtual('url')
.get(function() {
    return '/post/' + this._id;
})

module.exports = mongoose.model('Post', PostSchema);