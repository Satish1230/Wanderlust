const express = require('express');
const { route } = require('./listing');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirect } = require('../middleware.js');

router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});



router.post('/signup', wrapAsync(async (req, res) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new User({ email, username })
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Wanderlust');
            res.redirect('/listings');

        });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

router.post('/login', saveRedirect, passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: '/login',
}), wrapAsync(async (req, res) => {
    req.flash('success', 'Welcome back');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
}));


router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You have logged out!');
        res.redirect('/listings');
    });
});

module.exports = router;