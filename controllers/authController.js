const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { promisify } = require('util');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

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
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
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

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) getting the token and check if it's there

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // console.log(req.headers);
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError("You're not logged in. please login to get access.", 401),
    );
  }

  //   2) Verify token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log('decoded token', decoded);

  //   3) check if the user exists

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        'This user belonging to this token does not exist again',
        401,
      ),
    );
  }

  // 4) check if user chnaged password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. please login again', 401),
    );
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action'),
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on Posted email

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with the email address', 404));
  }

  // 2) Genrate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password, send a patch request with your new password and passwordConfirm to : ${resetURL}. \nIf you didn't forget your pasword please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token valid for 10 minutes',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    console.log('ERROR while sending email', err);
    return next(
      new AppError('There was an error sending email. Try again later', 500),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on hashed token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  console.log({ hashedToken });

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  console.log({ user });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 500));
  }
  //   if (!req.body.password || !req.body.passwordConfirm) {
  //     return next(new AppError('Password and passwordConfirm is required', 500));
  //   }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;

  await user.save();

  //   Send user the jwt token
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
