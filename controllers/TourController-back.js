//const axios = require('axios');
const Tour = require('../model/Tours');

exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,difficulty';
    next();
};

class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(field => delete queryObj[field]);

        const queryStr = JSON.stringify(queryObj).replace(
            /\b(gte|gt|lte|lt)\b/g,
            match => `$${match}`
        );
        console.log(queryStr);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.query.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const field = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(field);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

exports.getAllTours = async (req, res, next) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;

        return res.status(200).json({
            status: 'success',
            current_page: req.query.page * 1,
            timestamp: `${req.requestedDate} - ${req.requestedTime}`,
            data: { tours }
        });
    } catch (err) {
        res.status(400).json({
            message: 'Error...Something went wrong'
        });
    }
};

exports.getSingleTour = async (req, res, next) => {
    const { id } = req.params;
    const getTour = await Tour.find({ _id: id });

    return res.status(200).json({
        status: 'success',
        timestamp: `${req.requestedDate} - ${req.requestedTime}`,
        data: { getTour }
    });
};

exports.addTour = async (req, res, next) => {
    const tour = new Tour({
        name: req.body.name,
        duration: req.body.duration,
        maxGroupSize: req.body.maxGroupSize,
        difficulty: req.body.difficulty,
        ratingsAverage: req.body.ratingsAverage,
        ratingsQuantity: req.body.ratingsQuantity,
        price: req.body.price,
        discount: req.body.discount,
        summary: req.body.summary,
        description: req.body.description,
        imageCover: req.body.imageCover,
        images: req.body.images,
        startDates: req.body.startDates
    });

    try {
        const saveTour = await tour.save();
        res.status(201).json({
            success: true,
            timestamp: `${req.requestedDate} - ${req.requestedTime}`,
            saveTour
        });
    } catch (err) {
        res.status(400).json({
            message: err
        });
    }
};

exports.updateTour = async (req, res, next) => {
    const { id } = req.params;

    try {
        const getTour = await Tour.findOne({ _id: id });

        if (getTour) {
            getTour.name = req.body.name;
            getTour.rating = req.body.rating;
            getTour.price = req.body.price;

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
    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
};

exports.filterTours = (req, res) => {};

exports.deleteTour = async (req, res, next) => {
    const { id } = req.params;
    await Tour.deleteOne({ _id: id });

    return res.status(203).json({
        status: 'success',
        timestamp: `${req.requestedDate} - ${req.requestedTime}`
    });
};
