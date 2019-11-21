const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            min: 2,
            required: [true, 'A name must have a name'],
            minlength: [10, 'The name must be at least 10 chatacters long'],
            maxlength: [40, 'The name must not exceed 40 characters']
        },
        email: {
            type: String,
            required: [true, 'An email must be specified'],
            minlength: [10, 'The email must be at least 10 chatacters long'],
            unique: true,
            lowercase: true
        },
        photo: {
            url: String,
            minlength: [10, 'The url must be at least 10 chatacters long']
        },
        password: {
            type: String,
            min: 5,
            required: [true, 'An email must be specified']
        },
        confirmPassword: {
            type: String,
            min: 5,
            required: [true, 'The confrmation email must be specified']
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);
