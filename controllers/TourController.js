// const Tour = require('../model/Tours');

exports.checkBody = (req, res, next) => {
    const { name, location } = req.body;

    if (!name || !location) {
        return res.status(400).json({
            status: 'Failed',
            message: 'Please fill in the name and the price'
        });
    }
    next();
};

exports.getAllTours = (req, res, next) => {
    return res.status(200).json({
        status: 'success',
        timestamp: `${req.requestedDate} - ${req.requestedTime}`,
        data: {}
    });
};

exports.getSingleTour = (req, res, next) => {
    return res.status(200).json({
        status: 'success',
        timestamp: `${req.requestedDate} - ${req.requestedTime}`,
        data: {}
    });
};

exports.addTour = (req, res, next) => {
    return res.status(200).json({
        status: 'success',
        timestamp: `${req.requestedDate} - ${req.requestedTime}`,
        data: {}
    });
};

exports.deleteTour = (req, res, next) => {
    return res.status(200).json({
        status: 'success',
        timestamp: `${req.requestedDate} - ${req.requestedTime}`,
        data: {}
    });
};
