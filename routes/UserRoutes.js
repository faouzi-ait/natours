const router = require('express').Router();
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');

const routesURI = {
    user: '/users',
    userParam: '/users/:id',
    signup: '/users/signup',
    login: '/users/login',
    forgotPassword: '/users/forgotPassword',
    resetPassword: '/users/resetPassword/:token'
};

router.post(routesURI.signup, AuthController.signup);
router.post(routesURI.login, AuthController.login);

router.post(routesURI.forgotPassword, AuthController.forgotPassword);
router.patch(routesURI.resetPassword, AuthController.resetPassword);

router
    .route(routesURI.userParam)
    .get(UserController.getSingleUser)
    .delete(UserController.deleteUser);

router
    .route(routesURI.user)
    .get(UserController.getAllUsers)
    .post(UserController.addUser);

module.exports = router;
