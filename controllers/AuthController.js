const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../configuration/config');
const User = require('../model/Users');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendMail = require('../utils/email');

const generateToken = user => {
    return jwt.sign(
        { id: user._id, email: user.email, roles: user.roles },
        config.params.JWT_SECRET,
        {
            expiresIn: config.params.JWT_EXPIRE
        }
    );
};

const createCookie = (res, token) => {
    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') options.secure = true;

    return res.cookie('jwt', token, options);
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    const token = generateToken(newUser);

    createCookie(res, token);

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
    const token = generateToken(user);

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

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on Posted email
    const userEmailsArray = [];
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(
            new AppError('There is no user with this email address.', 404)
        );
    }

    // 2) Generate the random reset token (Create PasswordResetToken in User model)
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to the user's email (Email body contains a recreated link )
    userEmailsArray.push(user.email);
    userEmailsArray.push('joebarne15@gmail.com');

    const message = `Click on this link to reset your password: ${
        req.protocol
    }://${req.get('host')}/api/v1/users/resetPassword/${resetToken}
    If you didnt forget your password, please forget this email`;

    const subject = 'Here is your password reset, valid for 10 minutes';

    try {
        await sendMail(userEmailsArray, subject, message);
        res.status(200).json({
            success: true,
            message:
                'Your reset password token was successfully sent to your inbox'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            'There was an error sending the email. Try again later.',
            500
        );
    }
    next();
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) GET USER BASED ON TOKEN
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    // 2) IF TOKEN HASNT EXPIRED AND THERE IF A USER, SET THE NEW PASSWORD
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Token is invalid or has expired'), 400);
    }

    // 3) UPDATE PASSWORD CHANGED AT PROPERTY FOR THE USER
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // 4) LOG THE USER, SEND JWT TO THE USER
    const token = generateToken(user);

    res.status(201).json({
        status: 'success',
        token
    });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) GET THE USER FROM THE COLLECTION
    const { currentPassword, password, confirmPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    // 2) CHECK IF THE POSTED PASSWORD IS CORRECT
    if (!(await user.verifyPassword(currentPassword, user.password))) {
        return next(new AppError('Your password is not correct', 401));
    }
    // 3) IF CORRECT, UPDATE THE PASSWORD
    user.password = password;
    user.confirmPassword = confirmPassword;
    await user.save();

    // 4) LOG IN THE USER AND SEND THE JWT
    const token = generateToken(user);

    res.status(200).json({
        status: 'success',
        token
    });
});
