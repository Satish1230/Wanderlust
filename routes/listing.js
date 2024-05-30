const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync.js');
const { Listingschema, reviewschema } = require("../schema.js")
const Listing = require('../models/listing.js');
const ExpressError = require('../utils/ExpressError.js');
const { isloggedin, isOwner } = require('../middleware.js');

//converting joe into a middleware
// const validateListing = (req, res, next) => {
//     let { error } = Listingschema.validate(req.body);
//     if (error) {
//         let message = error.details.map((el) => el.message).join(',');
//         throw new ExpressError(400, message);
//     } else {
//         next();
//     }
// }

// index route
router.get('/', wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}));

// new route
router.get('/new', isloggedin, (req, res) => {
    res.render("listings/new.ejs");
});

//create route
router.post('/', isloggedin, async (req, res) => {
    // let { title, description, price, location, country } = req.body;
    const newlisting = new Listing(req.body.listing)
    newlisting.owner = req.user._id;
    const listing = await newlisting.save();
    req.flash('success', 'New listing Created!');
    res.redirect("/listings");

});

// show route
router.get('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews').populate('owner');//populate is used to get the reviews of the listing through ID
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        res.redirect('/listings');
    }


    res.render("listings/show.ejs", { listing });
}));

// edit route
router.get('/:id/edit', isloggedin, wrapAsync(async (req, res) => {
    let { id } = req.params;             //this line and the next line find the listing by id
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        res.redirect('/listings');
    }
    res.render("listings/edit.ejs", { listing });
}));

// update route
router.put('/:id', isloggedin, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash('success', 'Listing updated!');
    res.redirect("/listings");
}))

// delete route
router.delete('/:id', isloggedin, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted!');
    res.redirect("/listings");
}));

module.exports = router;