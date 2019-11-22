const router = require('express').Router();
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');

const routesURI = {
    userParam: '/users/:id',
    user: '/users',
    signup: '/users/signup'
};

router.post(routesURI.signup, AuthController.signup);

router
    .get(routesURI.userParam, UserController.getSingleUser)
    .delete(routesURI.userParam, UserController.deleteUser);

router
    .get(routesURI.user, UserController.getAllUsers)
    .post(routesURI.user, UserController.addUser);

module.exports = router;
