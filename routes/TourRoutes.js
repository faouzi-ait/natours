const router = require('express').Router();
const TourController = require('../controllers/TourController');

const routesURI = {
    tourParam: '/tours/:id',
    tour: '/tours'
};

router
    .get(routesURI.tourParam, TourController.getSingleTour)
    .delete(routesURI.tourParam, TourController.deleteTour);

router
    .get(routesURI.tour, TourController.getAllTours)
    .post(routesURI.tour, TourController.checkBody, TourController.addTour);

module.exports = router;
