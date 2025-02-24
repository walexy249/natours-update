const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //   Find user
  const user = await User.findOne({ email: email }).select('+password');

  // check if user or password is valid
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Generate token
  const token = signToken(user._id);

  // Send response
  res.status(200).json({
    status: 'success',
    token,
  });
});
