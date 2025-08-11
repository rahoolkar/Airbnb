const Joi = require("joi");

const listingSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
  image: Joi.string()
    .allow("")
    .uri({ allowRelative: false }) // Only allow valid URLs if provided
    .optional(),
  price: Joi.number().positive().required(),
});

module.exports = listingSchema;
