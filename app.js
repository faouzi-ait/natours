require('dotenv/config');

// IMPORT REQUIRED MODULES
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./configuration/config');

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
app.use('/api/v1', require('./routes/TourRoutes'));
app.use('/api/v1', require('./routes/UserRoutes'));

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
