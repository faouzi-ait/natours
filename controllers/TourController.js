//const axios = require('axios');
const Tour = require('../model/Tours');

exports.getAllTours = async (req, res, next) => {
    try {
        const tourList = await Tour.find();

        return res.status(200).json({
            status: 'success',
            number_of_tours: tourList.length,
            timestamp: `${req.requestedDate} - ${req.requestedTime}`,
            data: { tourList }
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

exports.deleteTour = async (req, res, next) => {
    const { id } = req.params;
    await Tour.deleteOne({ _id: id });

    return res.status(203).json({
        status: 'success',
        timestamp: `${req.requestedDate} - ${req.requestedTime}`
    });
};
