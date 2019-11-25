const router = require('express').Router();
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');

const routesURI = {
    user: '/users',
    userParam: '/users/:id',
    signup: '/users/signup',
    login: '/users/login',
    updateUser: '/users/updateUser',
    forgotPassword: '/users/forgotPassword',
    resetPassword: '/users/resetPassword/:token',
    updatePassword: '/users/updatePassword'
};

router.post(routesURI.signup, AuthController.signup);
router.post(routesURI.login, AuthController.login);

router.post(routesURI.forgotPassword, AuthController.forgotPassword);
router.patch(routesURI.resetPassword, AuthController.resetPassword);

router.patch(
    routesURI.updatePassword,
    AuthController.protectedRoutes,
    AuthController.updatePassword
);

router.patch(
    routesURI.updateUser,
    AuthController.protectedRoutes,
    UserController.updateUser
);

router
    .route(routesURI.userParam)
    .get(UserController.getSingleUser)
    .delete(UserController.deleteUser);

router
    .route(routesURI.user)
    .get(UserController.getAllUsers)
    .post(UserController.addUser);

module.exports = router;
