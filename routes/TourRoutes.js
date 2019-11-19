const router = require('express').Router();
const TourController = require('../controllers/TourController');

const routesURI = {
    tourParam: '/tours/:id',
    tour: '/tours'
};

router
    .route(routesURI.tourParam)
    .get(TourController.getSingleTour)
    .delete(TourController.deleteTour)
    .put(TourController.updateTour);

router
    .route(routesURI.tour)
    .get(TourController.getAllTours)
    .post(TourController.addTour);

module.exports = router;
