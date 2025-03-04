// review, rating, createdAt
const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'A review must have a rating'],
      min: [1, 'A rating must not be less than 1'],
      max: [5, 'A rating must not be more than 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      reuired: [true, 'A review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      reuired: [true, 'A review must belong to a user'],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
