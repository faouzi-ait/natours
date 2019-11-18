const router = require('express').Router();
const TourController = require('../controllers/TourController');

const routesURI = {
    tourParam: '/tours/:id',
    tour: '/tours'
};

router
    .get(routesURI.tourParam, TourController.getSingleTour)
    .delete(routesURI.tourParam, TourController.deleteTour)
    .put(routesURI.tourParam, TourController.updateTour);

router
    .get(routesURI.tour, TourController.getAllTours)
    .post(routesURI.tour, TourController.addTour);

module.exports = router;
