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

exports.addUser = (req, res, next) => {
    return res.status(201).json({
        status: 'success',
        requestTimeStamp: `${req.requestedDate} - ${req.requestedTime}`,
        data: {
            message: 'User Created'
        }
    });
};

exports.getAllUsers = (req, res, next) => {
    return res.status(200).json({
        status: 'success',
        requestTimeStamp: `${req.requestedDate} at: ${req.requestedTime}`,
        results: '',
        data: {
            userList: 'List Here'
        }
    });
};

exports.getSingleUser = (req, res, next) => {
    const { id } = req.params;

    return res.status(200).json({
        status: 'success',
        requestTimeStamp: `${req.requestedDate} - ${req.requestedTime}`,
        data: {
            User: `User ID: ${id}`
        }
    });
};

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
        requestTimeStamp: `${req.requestedDate} - ${req.requestedTime}`,
        data: {
            user
        }
    });
});

exports.deleteUser = (req, res, next) => {
    const { id } = req.params;

    return res.status(203).json({
        status: 'success',
        requestTimeStamp: `${req.requestedDate} - ${req.requestedTime}`,
        data: {
            message: `User: ${id} was successfully removed`
        }
    });
};
