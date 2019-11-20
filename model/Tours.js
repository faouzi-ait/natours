const mongoose = require('mongoose');

const tourSchema = mongoose.Schema(
    {
        name: {
            type: String,
            min: 2,
            required: [true, 'A tour must have a name'],
            minlength: [10, 'The name must be at least 10 chatacters long'],
            maxlength: [40, 'The name must not exceed 40 characters'],
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
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either: easy, medium, difficult'
            }
        },
        ratingsAverage: {
            type: Number,
            default: 0,
            min: [1, 'Ratings must be above 1.0'],
            max: [5, 'Ratings must be below 5.0']
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
            default: Date.now(),
            select: false // WILL NOT BE DISPLAYED IN API
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
