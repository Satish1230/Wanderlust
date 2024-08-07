const express = require('express');
const { route } = require('./listing');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirect } = require('../middleware.js');
const userController = require('../controllers/user.js');

router.get('/signup', (userController.renderSignup))

router.post('/signup', wrapAsync(userController.signupPage));

router.get('/login', (userController.renderLogin));

router.post('/login', saveRedirect, passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: '/login',
}), wrapAsync(userController.loginPage));


router.get('/logout', (userController.logoutPage));

module.exports = router;