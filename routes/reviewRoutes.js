const express = require('express');

const reviewControllers = require('./../controllers/reviewControllers');
const authControllers = require('./../controllers/authControllers');

const router = express.Router({ mergeParams: true });
// mergeParams merge this review params with tour route params

router.use(authControllers.protect);

router
  .route('/')
  .get(reviewControllers.getAllReviews)
  .post(
    authControllers.restrictTo('user'),
    reviewControllers.setUserTourIds,
    reviewControllers.createReview
  );

router
  .route('/:id')
  .get(reviewControllers.getReview)
  .patch(authControllers.restrictTo('user'), reviewControllers.updateReview)
  .delete(
    authControllers.restrictTo('user', 'admin'),
    reviewControllers.deleteReview
  );

//router.route('/:user/:tour').get(reviewControllers.getReview);
//  .patch(authControllers.protect, reviewControllers.updateReview);
//  .delete(authControllers.protect, reviewControllers.deleteReview);

module.exports = router;
