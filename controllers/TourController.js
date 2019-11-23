//const axios = require('axios');
const Tour = require('../model/Tours');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
    next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
    // 1 FILTERING
    const query = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];

    excludeFields.forEach(field => delete query[field]);

    // 2 ADVANCED FILTERING TO USE GT, LT, GTE, LTE OPERATORS
    let queryStr = JSON.stringify(query);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let q = Tour.find(JSON.parse(queryStr));

    // 3 SORTING
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        q = q.sort(sortBy);
    } else {
        q = q.sort('-createdAt');
    }

    // 4 FIELD LIMITING: ONLY DISPLAY THE SPECIFIED FIELDS
    if (req.query.fields) {
        const field = req.query.fields.split(',').join(' ');
        q = q.select(field);
    } else {
        q = q.select('-__v');
    }

    // 5 PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    q = q.skip(skip).limit(limit);

    if (req.query.page) {
        const numTour = await Tour.countDocuments();
        if (skip >= numTour) throw new Error('The page doesnt exist');
    }

    // EXECUTE QUERY
    const tours = await q;
    const count = await q.countDocuments();

    return res.status(200).json({
        status: 'success',
        number_of_tours: count,
        current_page: req.query.page * 1 || 1,
        total_pages: Math.ceil(count / limit),
        timestamp: `${req.requestedDate} - ${req.requestedTime}`,
        data: { tours }
    });
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
