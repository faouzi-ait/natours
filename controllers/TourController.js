//const axios = require('axios');
const Tour = require('../model/Tours');

exports.getAllTours = async (req, res, next) => {
    // 1 FILTERING
    const query = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];

    excludeFields.forEach(field => delete query[field]);

    try {
        // 2 ADVANCED FILTERING TO USE GT, LT, GTE, LTE OPERATORS
        const queryStr = JSON.stringify(query).replace(
            /\b(gte|gt|lte|lt)\b/g,
            match => `$${match}`
        );

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

        // const totalPages = tours.length;
        const numOfProducts = await Tour.count(query);

        return res.status(200).json({
            status: 'success',
            number_of_tours: count,
            current_page: req.query.page * 1,
            total_pages: Math.ceil(numOfProducts / limit),
            timestamp: `${req.requestedDate} - ${req.requestedTime}`,
            data: { tours }
        });
    } catch (err) {
        res.status(400).json({
            message: err
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
