const mongoose = require('mongoose');

const tourSchema = mongoose.Schema(
    {
        name: {
            type: String,
            min: 2,
            required: [true, 'A tour must have a name'],
            unique: true
        },
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty']
        },
        ratingsAverage: {
            type: Number,
            default: 0
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            min: 4,
            required: [true, 'A tour must have a price']
        },
        discount: {
            type: Number
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a summary']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now()
        },
        startDates: {
            type: [Date]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Tour', tourSchema);
