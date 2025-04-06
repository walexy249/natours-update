const express = require('express');
const reviewControler = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewControler.getAllReviews)
  .post(
    authController.restrictTo('user', 'admin'),
    reviewControler.setTourUserId,
    reviewControler.createReview,
  );
router
  .route('/:id')
  .get(reviewControler.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewControler.updateReview,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewControler.deleteReview,
  );

module.exports = router;
