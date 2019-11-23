require('dotenv/config');

// IMPORT REQUIRED MODULES
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./configuration/config');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/ErrorController');

// SET IN .ENV FILE
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// USE MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());
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
