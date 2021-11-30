const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review cannot be empty!'],
    },
    rating: {
      type: Number,
      required: [true, 'A rating is required to submit review'],
      min: [1, 'A review cannot be less than 1'],
      max: [5, 'A review cannot be more than 5'],
    },
    tourId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour'],
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user'],
    },
    createdAt: { type: Date, default: Date.now() },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tourId: 1, userId: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // });

  next();
});

reviewSchema.statics.calcAverageRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tourId: tourId },
    },
    {
      $group: {
        _id: '$tourId',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.tourId);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.rev = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  //await this.findOne() does not work here because the query is alredy executed
  await this.rev.constructor.calcAverageRating(this.rev.tourId);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
