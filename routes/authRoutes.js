// initial setup for the router
const express = require('express');
const router = express.Router();

// import the controllers
const { register, login, logout } = require('../controllers/authController');

// definition of the routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;
