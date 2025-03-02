const { mongoose } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: [validator.isEmail, 'Invalid is email'],
    unique: true,
    lowercase: true,
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    message: 'user must have a role',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'mimimum length of password is 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlength: [8, 'mimimum length of password confirm is 8 characters'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Password is not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: false,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  // omly run this function if password is modified
  if (!this.isModified('password')) return next();

  //   Hash the password password
  this.password = await bcrypt.hash(this.password, 12);

  //   console.log('Password encrypted', this.password);

  //  delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  // omly run this function if password is modified and
  if (!this.isModified('password') || this.isNew) return next();

  // Update the passwordChangedAt date
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({
    active: {
      $ne: false,
    },
  });
  next();
});

userSchema.methods.comparePassword = async function (
  plainPassword,
  EncryptedPassword,
) {
  return await bcrypt.compare(plainPassword, EncryptedPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimeStamp =
      new Date(this.passwordChangedAt).getTime() / 1000;

    return JWTTimestamp < passwordChangedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //   console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
