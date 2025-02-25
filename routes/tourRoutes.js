const express = require('express');
const authController = require('../controllers/authController');

const tourController = require('./../controllers/tourController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(tourController.aliastTopCheapTours, tourController.getAllTour);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plans/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTour)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
