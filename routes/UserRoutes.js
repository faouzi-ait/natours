const router = require('express').Router();
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');

const routesURI = {
    userList: '/users',
    userParam: '/users/:id',
    signup: '/users/signup',
    login: '/users/login',
    delete: '/users/delete',
    updateUser: '/users/updateUser',
    forgotPassword: '/users/forgotPassword',
    resetPassword: '/users/resetPassword/:token',
    updatePassword: '/users/updatePassword'
};

router.post(routesURI.signup, AuthController.signup);
router.post(routesURI.login, AuthController.login);

router.post(
    routesURI.forgotPassword,
    AuthController.protectedRoutes,
    AuthController.forgotPassword
);

router.patch(
    routesURI.resetPassword,
    AuthController.protectedRoutes,
    AuthController.resetPassword
);

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
    .delete(AuthController.protectedRoutes, UserController.deleteUser);

router.route(routesURI.userList).get(UserController.getAllUsers);
// .get(AuthController.protectedRoutes, UserController.getAllUsers);

module.exports = router;
