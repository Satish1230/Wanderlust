const Listing = require('./models/listing');
const Review = require('./models/review');
const { listingSchema, reviewschema } = require('./schema');

module.exports.isloggedin = (req, res, next) => {    //middleware to check if user is logged in
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}
module.exports.saveRedirect = (req, res, next) => {     //middleware to save the redirect url
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    if (!res.locals.currUser && res.locals.currUser._id.equals(listing.owner._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {

    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId)
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}