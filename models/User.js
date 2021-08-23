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
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Enter a valid password.']
        },
        profilePhoto: {
            type: String
        },
        created_at: { type: Date, default: Date.now },
        friends: [{type: Schema.Types.ObjectId, ref:'User'}]
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