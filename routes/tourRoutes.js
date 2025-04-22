const express = require('express');
const authController = require('../controllers/authController');

const tourController = require('./../controllers/tourController');
const reviewControler = require('./../controllers/reviewController');

const reviewRouter = require('./reviewRouter');

const router = express.Router();

// router.param('id', tourController.checkID);

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliastTopCheapTours, tourController.getAllTour);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plans/:year')
  .get(authController.protect, tourController.getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router
  .route('/')
  .get(tourController.getAllTour)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewControler.createReview,
//   );

module.exports = router;
