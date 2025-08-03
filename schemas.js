const baseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');
const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) return helpers.error('string.escapeHTML', { value })
        return clean;
      }
    }
  }
})
const joi = baseJoi.extend(extension)
module.exports.foodzoneSchema = joi.object({
  foodzone: joi.object({
    name: joi.string().required().escapeHTML(),
    location: joi.string().required().escapeHTML(),
    avgPrice: joi.string().pattern(/^\d+\s*-\s*\d+$/).required().messages({
      'string.pattern.base': 'Price must be a range like "250-350".',
      'string.empty': 'Price is required.'
    }),
    //images: joi.string(),
    description: joi.string().required().escapeHTML(),
    date : joi.string()

  }).required(),

  deleteImages: joi.array()


})
module.exports.reviewSchema = joi.object({
  review: joi.object({
    body: joi.string().required().escapeHTML(),
    rating: joi.number().min(1).max(5)
  }).required()
});
