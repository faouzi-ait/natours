require('dotenv/config');

// IMPORT REQUIRED MODULES
const express = require('express');
const morgan = require('morgan');

// SECURITY MIDDLEWARES
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./configuration/config');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/ErrorController');

// SET IN .ENV FILE
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many were made from this IP, please try again for an hour'
});

// USE MIDDLEWARE
app.use(helmet());
app.use(cors());
app.use('/api', limiter);
app.use(bodyParser.json({ limit: '10kb' }));

app.use(mongoSanitize());
app.use(xssClean());

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use((req, res, next) => {
    const time = new Date().toISOString();

    req.requestedDate = time.split('T')[0];
    req.requestedTime = time.split('T')[1].split('.')[0];

    next();
});

// ROUTES
const URI = {
    baseAPI: '/api/v1',
    notFound: '*'
};

app.use(URI.baseAPI, require('./routes/TourRoutes'));
app.use(URI.baseAPI, require('./routes/UserRoutes'));

app.all('*', (req, res, next) => {
    next(new AppError(`The route ${req.originalUrl} was not found`, 404));
});

app.use(globalErrorHandler);

app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsAverage',
            'ratingsQuantity',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    })
);

// DB CONNECTION
mongoose
    .connect(config.params.db_url, config.params.db, () =>
        console.log('connected...')
    )
    .catch(err => console.log('DB Connection Failed'));

// SERVER LISTENING PORT
app.listen(config.params.port(), () => {
    console.log(`Listening on port ${config.params.port()}`);
});
