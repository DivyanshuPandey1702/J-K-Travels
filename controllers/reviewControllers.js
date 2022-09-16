const Review = require('./../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const handlerFactory = require('./handlerFactory');

exports.setUserTourIds = (req, res, next) => {
  req.body.userId = req.user.id;
  req.body.tourId = req.params.tourId || req.query.tourId;
  next();
};

exports.getAllReviews = handlerFactory.getAll(Review);
exports.getReview = handlerFactory.getOne(Review);
exports.createReview = handlerFactory.createOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
exports.deleteReview = handlerFactory.deleteOne(Review);

// exports.getReview = catchAsync(async (req, res, next) => {
//   const review = await Review.findOne({
//     user: req.params.user,
//     tour: req.params.tour,
//   });

//   if (!review) return next(new AppError('No review found!', 404));

//   res.status(200).json({
//     status: 'success',
//     data: {
//       review,
//     },
//   });
// });

// exports.createReview = catchAsync(async (req, res, next) => {
//   const review = await Review.create(req.body);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       review,
//     },
//   });
// });

// exports.updateReview = catchAsync(async (req, res, next) => {
//   const review = await Review.findOneAndUpdate(
//     {
//       user: req.params.user,
//       tour: req.params.tour,
//     },
//     { review: req.body.review, rating: req.body.rating }
//   );

//   if (!review) return next(new AppError('No review found!', 404));

//   res.status(200).json({
//     status: 'success',
//     data: {
//       review,
//     },
//   });
// });

// exports.deleteReview = catchAsync(async (req, res, next) => {
//   const review = await Review.findOneAndDelete({
//     user: req.params.user,
//     tour: req.params.tour,
//   });

//   if (!review) return next(new AppError('No review found!', 404));

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });
