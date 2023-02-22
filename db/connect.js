const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // avoid deprecation warning

const connectDB = (url) => {
  return mongoose.connect(url);
};

module.exports = connectDB;
