const User = require('../model/Users');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};

    Object.keys(obj).forEach(item => {
        if (allowedFields.includes(item)) {
            newObj[item] = obj[item];
        }
    });
    return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    if (!users) {
        return next(new AppError('User not found', 401));
    }

    return res.status(200).json({
        status: 'success',
        requestTimeStamp: `${req.requestedDate} at ${req.requestedTime}`,
        data: {
            users
        }
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    // 1) FILTERED OUT UNWANTED FIELDS NAMES
    const filterBody = filterObj(req.body, 'name', 'surname', 'email');

    // 2) UPDATE THE USER DETAILS
    const user = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(new AppError('User not found', 401));
    }

    return res.status(200).json({
        status: 'success',
        requestTimeStamp: `${req.requestedDate} at ${req.requestedTime}`,
        data: {
            user
        }
    });
});

exports.deleteUser = (req, res, next) => {
    // TODO: USE THE USER FROM THE REQUEST OBJECT
};
