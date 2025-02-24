const { mongoose } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
});

userSchema.pre('save', async function (next) {
  // omly run this function if password is modified
  if (!this.isModified('password')) return next();

  //   Hash the password password
  this.password = await bcrypt.hash(this.password, 12);

  //  delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = async function (
  plainPassword,
  EncryptedPassword,
) {
  return await bcrypt.compare(plainPassword, EncryptedPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
