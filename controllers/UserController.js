// const User = require('../model/Users');

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
