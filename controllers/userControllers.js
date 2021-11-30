const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const handlerFactory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates', 400));
  }

  // filter out unwanted fields
  const filteredBody = filterObj(req.body, 'name', 'photo');

  // update user data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Route is not defined! Please use /signup instead.',
  });
};

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: 'fail',
//     message: 'Route is not yet Working...',
//   });
// };

// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'fail',
//     message: 'Route is not yet Working...',
//   });
// };

// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'fail',
//     message: 'Route is not yet Working...',
//   });
// };
