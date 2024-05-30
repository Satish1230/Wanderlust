const Joi = require('joi');

module.exports.Listingschema = Joi.object({
    Listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
        price: Joi.number().required(),
        location: Joi.string().required().min(0),
        country: Joi.string().required()
    }).required(),
});
module.exports.reviewschema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        comment: Joi.string().required(),
    }).required(),
});