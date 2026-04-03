const Joi = require("joi");

const contactSchema = Joi.object({
  firstName: Joi.string().min(3).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 3 characters"
  }),
  lastName: Joi.string().min(3).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 3 characters"
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid"
  }),
  favoriteColor: Joi.string().min(3).required().messages({
    "string.empty": "Favorite color is required",
    "string.min": "Favorite color must be at least 3 characters"
  }),
  birthday: Joi.date().less('now').required().messages({
    "date.base": "Birthday must be a valid date",
    "date.less": "Birthday cannot be in the future"
  }),
  phone: Joi.string().pattern(/^\d{10,11}$/).required().messages({
    "string.empty": "Phone is required",
    "string.pattern.base": "Phone must be 10 or 11 digits"
  }),
  address: Joi.string().min(5).required().messages({
    "string.empty": "Address is required",
    "string.min": "Address must be at least 5 characters"
  })
});

const validateContact = (req, res, next) => {
  const { error } = contactSchema.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = { validateContact };