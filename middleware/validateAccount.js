const Joi = require("joi");

// Create Account Validation
const accountSchema = Joi.object({
  userId: Joi.string().required().messages({
    "any.required": "User ID is required",
    "string.empty": "User ID cannot be empty",
    "string.base": "User ID must be a string"
  }),
  bankName: Joi.string().min(2).max(50).required().messages({
    "any.required": "Bank name is required",
    "string.empty": "Bank name cannot be empty",
    "string.min": "Bank name must be at least 2 characters",
    "string.max": "Bank name cannot exceed 50 characters",
    "string.base": "Bank name must be a string"
  }),
  accountNumber: Joi.string().min(5).max(20).required().messages({
    "any.required": "Account number is required",
    "string.empty": "Account number cannot be empty",
    "string.min": "Account number must be at least 5 characters",
    "string.max": "Account number cannot exceed 20 characters",
    "string.base": "Account number must be a string"
  }),
  accountType: Joi.string().valid("savings", "current", "wallet").required().messages({
    "any.required": "Account type is required",
    "any.only": "Account type must be one of: savings, current, wallet",
    "string.empty": "Account type cannot be empty"
  }),
  balance: Joi.number().min(0).optional().messages({
    "number.base": "Balance must be a number",
    "number.min": "Balance cannot be negative"
  }),
  currency: Joi.string().length(3).optional().messages({
    "string.base": "Currency must be a string",
    "string.length": "Currency must be exactly 3 characters (e.g., USD, NGN)"
  })
});

// Update Account Validation
const updateAccountSchema = Joi.object({
  balance: Joi.number().min(0).optional().messages({
    "number.base": "Balance must be a number",
    "number.min": "Balance cannot be negative"
  }),
  currency: Joi.string().length(3).optional().messages({
    "string.base": "Currency must be a string",
    "string.length": "Currency must be exactly 3 characters (e.g., USD, NGN)"
  }),
  accountType: Joi.string().valid("savings", "current", "wallet").optional().messages({
    "any.only": "Account type must be one of: savings, current, wallet",
    "string.empty": "Account type cannot be empty"
  })
}).min(1).messages({
  "object.min": "At least one field (balance, currency, accountType) is required to update"
});

module.exports = { accountSchema, updateAccountSchema };