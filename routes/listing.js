const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

const wrapAsync = require('../utils/wrapAsync.js');
const { Listingschema, reviewschema } = require("../schema.js")
const Listing = require('../models/listing.js');
const ExpressError = require('../utils/ExpressError.js');
const { isloggedin, isOwner } = require('../middleware.js');
const listingController = require('../controllers/listing.js');

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
router.get('/', wrapAsync(listingController.index));

// new route
router.get('/new', isloggedin, listingController.renderNewform);

//create route
router.post('/', isloggedin, upload.single("listing[image]"), listingController.createForm);
// router.post('/', upload.single('listing[image]'), listingController.createForm);
// router.post('/', upload.single("listing[image]"), (req, res) => { res.send(req.file) });

// show route
router.get('/:id', wrapAsync(listingController.createListing));

// edit route
router.get('/:id/edit', isloggedin, wrapAsync(listingController.renderEditForm));

// update route
router.put('/:id', isloggedin, isOwner, wrapAsync(listingController.updateListing))

// delete route
router.delete('/:id', isloggedin, wrapAsync(listingController.deleteListing));

module.exports = router;