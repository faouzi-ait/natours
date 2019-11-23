const router = require('express').Router();
const TourController = require('../controllers/TourController');
const protectedRoute = require('../controllers/AuthController');

const routesURI = {
    tourParam: '/tours/:id',
    topTours: '/tours/top-5-tours',
    tour: '/tours'
};

router
    .route(routesURI.topTours)
    .get(
        protectedRoute.protectedRoutes,
        TourController.aliasTopTours,
        TourController.getAllTours
    );

router
    .route(routesURI.tourParam)
    .get(TourController.getSingleTour)
    .delete(
        protectedRoute.protectedRoutes,
        protectedRoute.restrictTo('admin', 'guide'),
        TourController.deleteTour
    )
    .put(TourController.updateTour);

router
    .route(routesURI.tour)
    .get(protectedRoute.protectedRoutes, TourController.getAllTours)
    .post(TourController.addTour);

module.exports = router;
