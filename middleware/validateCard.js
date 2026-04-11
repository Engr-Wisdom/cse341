const Joi = require("joi");

const cardSchema = Joi.object({
  accountId: Joi.string().required().messages({
    "any.required": "Account ID is required",
    "string.empty": "Account ID cannot be empty",
    "string.base": "Account ID must be a string"
  }),

  name: Joi.string().min(2).max(50).required().messages({
    "any.required": "Cardholder name is required",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 50 characters",
    "string.base": "Name must be a string"
  }),

  cardNumber: Joi.string().min(10).max(25).required().messages({
    "any.required": "Card number is required",
    "string.empty": "Card number cannot be empty",
    "string.min": "Card number must be at least 10 characters",
    "string.max": "Card number cannot exceed 25 characters",
    "string.base": "Card number must be a string"
  }),

  cardType: Joi.string().valid("debit", "credit", "virtual").required().messages({
    "any.required": "Card type is required",
    "any.only": "Card type must be one of: debit, credit, virtual",
    "string.empty": "Card type cannot be empty"
  }),

  brand: Joi.string().valid("visa", "mastercard").required().messages({
    "any.required": "Card brand is required",
    "any.only": "Brand must be either visa or mastercard",
    "string.empty": "Brand cannot be empty"
  }),

  expiryDate: Joi.string().required().messages({
    "any.required": "Expiry date is required",
    "string.empty": "Expiry date cannot be empty"
  }),

  status: Joi.string().valid("active", "blocked").optional().messages({
    "any.only": "Status must be either active or blocked"
  })
});

const updateCardSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  cardNumber: Joi.string().min(10).max(25).optional(),
  cardType: Joi.string().valid("debit", "credit", "virtual").optional(),
  brand: Joi.string().valid("visa", "mastercard").optional(),
  expiryDate: Joi.string().optional(),
  status: Joi.string().valid("active", "blocked").optional()
}).min(1).messages({
  "object.min": "At least one field is required to update"
});

const validateCard = (req, res, next) => {
  const { error } = cardSchema.validate(req.body, { abortEarly: true });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};

const validateUpdateCard = (req, res, next) => {
  const { error } = updateCardSchema.validate(req.body, { abortEarly: true });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};

module.exports = {
  validateCard,
  validateUpdateCard
};