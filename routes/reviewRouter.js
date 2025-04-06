const express = require('express');
const reviewControler = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewControler.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewControler.createReview,
  );
router.route('/:id').delete(reviewControler.deleteReview);

module.exports = router;
