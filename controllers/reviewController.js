const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../utils/handlerFactory');

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };
//   const reviews = await Review.find(filter);

//   res.status(200).send({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

// exports.createReview = catchAsync(async (req, res, next) => {
//   const review = await Review.create({
//     review: req.body.review,
//     rating: req.body.rating,
//     tour: req.body.tour,
//     user: req.body.user,
//   });

//   res.status(200).send({
//     status: 'success',
//     data: {
//       review,
//     },
//   });
// });

exports.setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._Id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
