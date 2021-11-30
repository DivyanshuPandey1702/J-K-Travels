// Import
const express = require('express');

const tourControllers = require(`${__dirname}/../controllers/tourControllers`);
const authControllers = require(`${__dirname}/../controllers/authControllers`);
const reviewRouter = require('./reviewRoutes');

// Tours Routes
const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

//router param middleware
//router.param('id', tourControllers.checkId);

router
  .route('/top-5-cheap')
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

router.route('/tour-stats').get(tourControllers.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide', 'guide'),
    tourControllers.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourControllers.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourControllers.getDistances);

router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.createTour
  );
// .post(tourControllers.checkBody, tourControllers.createTour);
router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.updateTour
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour
  );

module.exports = router;
