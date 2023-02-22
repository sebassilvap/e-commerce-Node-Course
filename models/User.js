const mongoose = require('mongoose');
const validator = require('validator'); // use this package for validate the email
const bcrypt = require('bcryptjs'); // library to hash the passwords

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a Name'],
    minlength: 3,
    maxlength: 50,
  },

  email: {
    type: String,
    unique: true, // to have a unique email
    required: [true, 'Please provide an Email'],
    // using the validator from mongoose
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid Email',
    },
  },

  password: {
    type: String,
    required: [true, 'Please provide a Password'],
    minlength: 6,
  },

  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

// before we save the document -> hash the password
// we use the pre - hook
// REMEMBER: this points to the user
UserSchema.pre('save', async function () {
  //* TEST: when we use user.save() in updateUser
  // to check exactly what has been modified
  /*
  console.log(this.modifiedPaths());
  console.log(this.isModified('name'));
  */

  // do the hashing password if we modify the password
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// function that compares both hashed passwords
// REMEMBER: hashing is one way street
// the only thing I can do is take the value and compare it
// we use the old function keyword, so "this" points to the user, with arrow func, this does not happen!

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
