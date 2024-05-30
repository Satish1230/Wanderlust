const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { Listingschema, reviewschema } = require("../schema.js")
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');



//Review(post route)
router.post('/', async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash('success', 'Review posted!');
    res.redirect(`/listings/${listing._id}`);

});

//Review(delete route)
router.delete('/:reviewId', wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted!');
    res.redirect(`/listings/${id}`);
}));

module.exports = router;