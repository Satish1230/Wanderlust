const User = require('../models/user');

module.exports.renderSignup = async (req, res) => {
    res.render('users/signup.ejs');
}

module.exports.signupPage = async (req, res) => {
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
}

module.exports.renderLogin = async (req, res) => {
    res.render('users/login.ejs');
}

module.exports.loginPage = async (req, res) => {
    req.flash('success', 'Welcome back');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
}

module.exports.logoutPage = async (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You have logged out!');
        res.redirect('/listings');
    });
}