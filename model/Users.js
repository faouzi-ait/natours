const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A name must have a name'],
            minlength: [2, 'The name must be at least 10 chatacters long'],
            maxlength: [40, 'The name must not exceed 40 characters']
        },
        email: {
            type: String,
            required: [true, 'An email must be specified'],
            minlength: [10, 'The email must be at least 10 chatacters long'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email']
        },
        photo: {
            url: String
        },
        password: {
            type: String,
            minlength: 8,
            required: [true, 'An email must be specified']
        },
        confirmPassword: {
            type: String,
            required: [true, 'The confrmation email must be specified'],
            validate: {
                // WILL WORK ON SAVE() & CREATE()
                validator: function(el) {
                    return el === this.password;
                },
                message: 'Passwords must be the same'
            }
        }
    },
    {
        timestamps: true
    }
);

// SAVES THE PASSWORD HASHED ONCE BOTH PASSWORDS INPUT MATCH
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);

    // ONLY NEEDED FOR PASSWORD CONFIRMATION AND NOT PERSISTANCE
    this.confirmPassword = undefined;
    next();
});

module.exports = mongoose.model('User', userSchema);
