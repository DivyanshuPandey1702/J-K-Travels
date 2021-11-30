// Import
const express = require('express');

const authControllers = require(`${__dirname}/../controllers/authControllers`);
const userControllers = require(`${__dirname}/../controllers/userControllers`);

// Users Route
const router = express.Router();

router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);
router.post('/forgot-password', authControllers.forgotPassword);
router.patch('/reset-password/:token', authControllers.resetPassword);

router.use(authControllers.protect);

router.patch('/update-password', authControllers.updatePassword);
router.get('/me', userControllers.getMe, userControllers.getUser);
router.patch('/update-me', userControllers.updateMe);
router.patch('/delete-me', userControllers.deleteMe);

router.use(authControllers.restrictTo('admin'));

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);
router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
