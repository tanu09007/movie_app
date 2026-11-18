const Joi = require("joi");

const movieSchema = Joi.object({
  movie_name: Joi.string().trim().min(1).max(255).required(),
  year: Joi.number()
    .integer()
    .min(1888)
    .max(new Date().getFullYear() + 5)
    .required(),
});

module.exports = { movieSchema };
