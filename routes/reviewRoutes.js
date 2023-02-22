// initial setup for the router
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const {
  createReview,
  deleteReview,
  getAllReviews,
  getSingleReview,
  updateReview,
} = require('../controllers/reviewController');

router.route('/').post(authenticateUser, createReview).get(getAllReviews);
router
  .route('/:id')
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

module.exports = router;
