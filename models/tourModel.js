const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      minlength: [10, 'A tour name must not have at least 10 characters'],
      maxLength: [40, 'A tour name must not have more than 40 characters'],
    },
    slug: String,
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating cannot be less than 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount {VALUE} of must be less than the price',
      },
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'A tour difficulty can only be easy, medium and difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Summary is required for a tour'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Description is required for a tour'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image cover '],
    },
    startDates: {
      type: [Date],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    secretTour: {
      default: false,
      type: Boolean,
    },
    startLocation: {
      // GeoJson
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
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

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document middleware runs before .save() and .create() but not .insertMany
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function (next) {
//   const tourPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(tourPromises);
//   next();
// });

// tourSchema.pre('save', function (next) {
//   console.log('Will save documents');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log('finished doc', doc);
//   next();
// });

// Query Middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.startTime = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt -passwordResetExpires -passwordResetToken',
  });
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Time duration is ${Date.now() - this.startTime} milliseconds`);
  // console.log(docs);
  next();
});

// Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  // console.log(this.pipeline());
  next();
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
