const mongoose = require('mongoose');

const tourSchema = mongoose.Schema(
    {
        name: {
            type: String,
            min: 2,
            required: [true, 'A tourSchema must have a name'],
            unique: true
        },
        rating: {
            type: Number,
            min: 2,
            default: 0
        },
        price: {
            type: Number,
            min: 4,
            required: [true, 'A tour must have a price']
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Tour', tourSchema);
