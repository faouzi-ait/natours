const { promisify } = require('util');
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
    // const isExist = await User.find({ email: req.body.email });

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
        return next(new AppError('User not found', 401));
    }

    // 2 - CHECK IS USER EXIST & PASSWORD IS CORRECT
    const user = await User.findOne({ email }).select('+password');
    const checkUser = await user.verifyPassword(password, user.password);

    if (!checkUser || !user) {
        return next(
            new AppError('The user linked to this token does not exist', 401)
        );
    }

    // 3 - IF EVERYTHING IS OK, DELIVER TOKEN AND PROCESS LOGIN
    const token = generateToken(checkUser);

    res.status(200).json({
        status: 'success',
        token
    });
});

exports.protectedRoutes = catchAsync(async (req, res, next) => {
    let token = '';

    // 1 - GET THE TOKEN AND CHECK IT EXIST
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!req.headers.authorization) {
        // THROW AN ERROR
        return next(new AppError('You are not currently logged in', 401));
    }

    // 2 - CHECK IF THE TOKEN IS VALID
    const payload = await promisify(jwt.verify)(
        token,
        config.params.JWT_SECRET
    );

    // 3 - IF OK, CHECK THE USER STILL EXISTS
    const currentUser = await User.findById(payload.id);
    if (!currentUser) {
        return next(
            new AppError('The user linked to this token does not exist', 401)
        );
    }

    // 4 - CHECK IF USER CHANGED PASSWORD AFTER TOKEN WAS ISSUED
    if (currentUser.changedPasswordPostLogin(payload.iat)) {
        return next(
            new AppError('The password has been changed recently', 401)
        );
    }

    // ALOW THE USER TO ACCESS THE PROTECTED ROUTE
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.roles)) {
            return next(
                new AppError(
                    'You do not have permission to access this resource',
                    403
                )
            );
        }
        next();
    };
};
