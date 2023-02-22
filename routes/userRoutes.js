// initial setup for the router
const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

// import the controllers
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController');

// definition of the routes
// first authenticate the user, then we check to authorize permissions
router
  .route('/')
  .get(authenticateUser, authorizePermissions('admin'), getAllUsers);

router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);

//! REMEMBER: this '/:id' should be in the BOTTOM!
// look for that specific user
router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;
