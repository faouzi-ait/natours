const router = require('express').Router();
const UserController = require('../controllers/UserController');

const routesURI = {
    userParam: '/users/:id',
    user: '/users'
};

router
    .get(routesURI.userParam, UserController.getSingleUser)
    .delete(routesURI.userParam, UserController.deleteUser);

router
    .get(routesURI.user, UserController.getAllUsers)
    .post(routesURI.user, UserController.addUser);

module.exports = router;
