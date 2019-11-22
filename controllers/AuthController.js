const jwt = require('jsonwebtoken');
const User = require('../model/Users');
const config = require('../configuration/config');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const generateToken = newUser => {
    return jwt.sign(
        { id: newUser._id, email: newUser.email },
        config.params.JWT_SECRET,
        {
            expiresIn: config.params.JWT_EXPIRE
        }
    );
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    const token = generateToken(newUser);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            newUser
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1 - CHECK IS EMAIL & PASSWORD EXIST
    if (!email || !password) {
        return next(new AppError('Please provide your login details'), 400);
    }

    // 2 - CHECK IS USER EXIST & PASSWORD IS CORRECT
    const user = await User.findOne({ email }).select('+password');
    const checkUser = await user.verifyPassword(password, user.password);

    if (!checkUser || !user) {
        return next(new AppError('Incorrect login details'), 401);
    }

    // 3 - IF EVERYTHING IS OK, DELIVER TOKEN AND PROCESS LOGIN
    const token = generateToken(checkUser);

    res.status(200).json({
        status: 'success',
        token
    });
});
