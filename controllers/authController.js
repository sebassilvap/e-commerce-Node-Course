// model from the user
const User = require('../models/User');

// get the StatusCodes
const { StatusCodes } = require('http-status-codes');

// get the customer error
const CustomError = require('../errors');

// require the package jwt for the json web token
//const jwt = require('jsonwebtoken'); //? this goes to utils/jwt.js

// imports from utils
//const { createJWT } = require('../utils'); //? not needed since I attach the logic of the cookie
const { attachCookiesToResponse, createTokenUser } = require('../utils');

// ===========================================================

const register = async (req, res) => {
  //res.send('register user'); //* initial test

  const { email, name, password } = req.body;

  // check if the email is already in use
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists!');
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  //const user = await User.create(req.body);

  // create the user, but with the properties that I want
  // prevent taht somebody creates an account as admin
  const user = await User.create({ name, email, password, role });

  // once we create the user, issue the token
  /*//? Move this to utils/createTokenUser.js
  const tokenUser = {
    name: user.name,
    userId: user._id,
    role: user.role,
  };
  */
  const tokenUser = createTokenUser(user);

  /*//? Refactored with the utils folder
  const token = jwt.sign(tokenUser, 'jwtSecret', {
    expiresIn: '1d',
  });
  */

  /*//? this will be done in jwt.js
  const token = createJWT({ payload: tokenUser });

  // using the cookie, automatically available to us with express
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
  });
  */

  //? this function attach the cookie to the response !!!

  attachCookiesToResponse({
    res,
    user: tokenUser,
  });

  res.status(StatusCodes.CREATED).json({
    user: tokenUser,
    //token, //? this is not needed because now we'll work with cookies
  });
};

// ===========================================================

const login = async (req, res) => {
  //res.send('login user'); //* initial test
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials!');
  }

  // check whether the password is correct
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials!');
  }

  /*//? Move this to utils/createTokenUser.js
  const tokenUser = {
    name: user.name,
    userId: user._id,
    role: user.role,
  };
  */
  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({
    res,
    user: tokenUser,
  });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// ===========================================================

const logout = async (req, res) => {
  //res.send('logout user'); //* initial test

  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()), // remove the cookie fromt he browser!
  });

  res.status(StatusCodes.OK).json({
    msg: 'user logged out', // just for development purposes!
  });
};

// ===========================================================

module.exports = {
  register,
  login,
  logout,
};
