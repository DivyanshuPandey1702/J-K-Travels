const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get Tour Data
  const tours = await Tour.find();

  // 2) Build Template
  // 3) Render Template with Tour Data
  res.status(200).render('overview', { title: 'All Tours', tours });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', { title: 'Login to your account' });
});

exports.getSignupForm = catchAsync(async (req, res, next) => {
  res.status(200).render('signup', { title: 'Signup to your account' });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', { title: 'Account' });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data of requested tour including (review and guides)
  let tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating userId',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.'));
  }

  // 2) Build Template
  // 3) Render Template with Tour Data
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      'connect-src https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com'
    )
    .render('tour', { title: tour.name, tour });
});
