const mongoose = require('mongoose');
const { Listingschema } = require('../schema');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdata: {
        type: Date,
        default: Date.now(),
    },
});


const Listing = mongoose.model('Review', reviewSchema);
module.exports = Listing;