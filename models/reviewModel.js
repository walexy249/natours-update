// review, rating, createdAt
const mongoose = require('mongoose');
const Tour = require('./tourModel');

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

// this makes  a review unique so a user can't post a review more than once
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: {
        tour: tourId,
      },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats.length ? stats[0].avgRating : 4.5,
    ratingsQuantity: stats.length ? stats[0].nRating : 0,
  });

  console.log('stats', stats);
};

reviewSchema.post('save', function (doc, next) {
  // Review.calcAverageRating(this.tour);
  this.constructor.calcAverageRating(this.tour);

  next();
});

// findByIdAndUpdate
// findByIdAndDelete

// The following two schema help pazs the current doc to the post hook so the calcAverageRating get triggered when updating or deleting a review
// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   // this.r = await this.findOne().clone();
//   // console.log('this.r', this.r);
//   // console.log('Found document:', this.r);

//   next();
// });

reviewSchema.post(/^findOneAnd/, async function (doc) {
  console.log('Post-hook running');
  if (doc) {
    console.log('doc', doc);
    await doc.constructor.calcAverageRating(doc.tour);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
