const Review = require('../models/Review');
const Product = require('../models/Product');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermisions } = require('../utils');

// ==============================================================

const createReview = async (req, res) => {
  // grab product and destructure it
  const { product: productId } = req.body;

  // check if it is a valid product
  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  // check if user has submitted a review for the product
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      'Already submitted review for this product'
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

// ==============================================================

const getAllReviews = async (req, res) => {
  // use populate to obtain info about other properties of the element
  // for product & user
  const reviews = await Review.find({}).populate({
    path: 'product',
    select: 'name company price',
  });
  /*//? info about user
    .populate({
      path: 'user',
      select: 'name',
    });
	*/

  res.status(StatusCodes.OK).json({
    reviews,
    count: reviews.length,
  });
};

// ==============================================================

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

// ==============================================================

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  // make sure that the uer id matches to the one that made the review
  checkPermisions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

// ==============================================================

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  // make sure that the uer id matches to the one that made the review
  checkPermisions(req.user, review.user);

  await review.remove();

  res.status(StatusCodes.OK).json({ msg: 'Success! Review Removed!' });
};

// ==============================================================

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });

  res.status(StatusCodes.OK).json({
    reviews,
    count: reviews.length,
  });
};

// ==============================================================

module.exports = {
  createReview,
  deleteReview,
  getAllReviews,
  getSingleProductReviews,
  getSingleReview,
  updateReview,
};
