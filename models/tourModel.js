const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
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
      default: Date.now(),
      select: false,
    },
    secretTour: {
      default: false,
      type: Boolean,
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

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document middleware runs before .save() and .create() but not .insertMany
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

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

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Time duration is ${Date.now() - this.startTime} milliseconds`);
  console.log(docs);
  next();
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;

// {
//   "id": 7,
//   "name": "The Star Gazer",
//   "duration": 9,
//   "maxGroupSize": 8,
//   "difficulty": "medium",
//   "ratingsAverage": 4.7,
//   "ratingsQuantity": 28,
//   "price": 2997,
//   "summary": "The most remote and stunningly beautiful places for seeing the night sky",
//   "description": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//   "imageCover": "tour-8-cover.jpg",
//   "images": ["tour-8-1.jpg", "tour-8-2.jpg", "tour-8-3.jpg"],
//   "startDates": ["2021-03-23,10:00", "2021-10-25,10:00", "2022-01-30,10:00"]
// },
