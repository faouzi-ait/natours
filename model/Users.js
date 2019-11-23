const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Your name must have a name'],
            minlength: [2, 'The name must be at least 10 chatacters long'],
            maxlength: [40, 'The name must not exceed 40 characters']
        },
        surname: {
            type: String,
            required: [true, 'Your surname must have a surname'],
            minlength: [2, 'The surname must be at least 10 chatacters long'],
            maxlength: [40, 'The surname must not exceed 40 characters']
        },
        email: {
            type: String,
            required: [true, 'Your email must be specified'],
            minlength: [10, 'The email must be at least 10 chatacters long'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email']
        },
        photo: {
            url: String
        },
        roles: {
            type: String,
            enum: ['user', 'guide', 'lead', 'admin'],
            default: 'user'
        },
        password: {
            type: String,
            minlength: 8,
            required: [true, 'Please specify your password'],
            select: false
        },
        confirmPassword: {
            type: String,
            validate: {
                // WILL WORK ON SAVE() & CREATE()
                validator: function(el) {
                    return el === this.password;
                },
                message: 'Passwords must be the same'
            }
        },
        passwordChangedTime: Date
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

userSchema.methods.verifyPassword = async function(
    currentPassword,
    userPassword
) {
    return await bcrypt.compare(currentPassword, userPassword);
};

userSchema.methods.changedPasswordPostLogin = function(timestamp) {
    if (this.passwordChangedTime) {
        const changedTimeStamp =
            (this.passwordChangedTime.getTime() / 1000) * 1;
        return timestamp < changedTimeStamp;
    }
    return false;
};

module.exports = mongoose.model('User', userSchema);
