const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { Listingschema, reviewschema } = require("../schema.js")
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const { isloggedin, isAuthor } = require('../middleware.js');
const reviewController = require('../controllers/review.js');




//Review(post route)
// router.post('/', isloggedin(reviewController.createReview));
router.post('/', isloggedin, wrapAsync(reviewController.createReview));

//Review(delete route)
router.delete('/:reviewId', isloggedin, isAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;