const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Firstname is required.']
        },
        lastName: {
            type: String,
            required: [true, 'Lastname is required.']
        },
        password: {
            type: String,
            required: [true, 'Enter a valid password.']
        },
        profilePhoto: {
            type: String
        },
        friends: [{type: Schema.Types.ObjectId, ref:'User'}],
        posts: [{ type: Schema.Types.ObjectId, ref:'Post' }],
        comments: [{ type: Schema.Types.ObjectId, ref:'Comment' }],
    }
);

UserSchema
.virtual('fullname')
.get(function() {
    return this.firstName + ' ' + this.lastName;
})

UserSchema
.virtual('url')
.get(function() {
    return '/user/' + this._id;
})

module.exports = mongoose.model('User', UserSchema);