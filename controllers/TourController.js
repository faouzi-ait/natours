//const axios = require('axios');
const Tour = require('../model/Tours');
const catchAsync = require('../utils/catchAsync');
const { paginate } = require('./MiddleWare');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '3';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
    next();
};

exports.getAllTours = catchAsync(paginate(Tour), _ => {
    paginate(Tour);
});

exports.getSingleTour = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const getTour = await Tour.findById(id);

    if (!getTour) {
        return next(new AppError('No tour found with that ID', 404));
    }

    return res.status(200).json({
        status: 'success',
        timestamp: `${req.requestedDate} - ${req.requestedTime}`,
        data: { getTour }
    });
});

exports.addTour = catchAsync(async (req, res, next) => {
    const tour = new Tour(req.body);

    const saveTour = await tour.save();
    res.status(201).json({
        success: true,
        timestamp: `${req.requestedDate} - ${req.requestedTime}`,
        saveTour
    });
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const getTour = await Tour.findById(id);

    if (!getTour) {
        return next(new AppError('No tour found with that ID', 404));
    }

    if (getTour) {
        getTour.name = req.body.name;
        getTour.ratingsAverage = req.body.ratingsAverage;
        getTour.ratingsQuantity = req.body.ratingsQuantity;
        getTour.duration = req.body.duration;
        getTour.price = req.body.price;
        getTour.summary = req.body.summary;
        getTour.description = req.body.description;

        const updatedTour = await getTour.save();
        console.log(updatedTour);

        res.status(201).json({
            timestamp: `${req.requestedDate} - ${req.requestedTime}`,
            updatedTour
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'The tour you are looking for was not found'
        });
    }
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }

    await Tour.deleteOne({ _id: id });
    return res.status(203).json({
        success: true,
        timestamp: `${req.requestedDate} - ${req.requestedTime}`
    });
});
