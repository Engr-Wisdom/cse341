const Joi = require("joi");

const transactionSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.empty": "Amount is required"
  }),

  date: Joi.date().required().messages({
    "date.base": "Date must be valid",
    "date.empty": "Date is required"
  }),

  paymentMethod: Joi.string().valid("Cash", "Card", "Bank").required().messages({
    "string.empty": "Payment Method is required",
    "any.only": "Payment Method must be Cash, Card, or Bank"
  }),

  status: Joi.string().valid("Pending", "Completed", "Failed").optional(),

  invoiceNumber: Joi.string().required().messages({
    "string.empty": "Invoice number is required"
  }),

  notes: Joi.string().allow("").optional()
});

const validateTransaction = (req, res, next) => {
  const { error } = transactionSchema.validate(req.body, { abortEarly: true });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

module.exports = { validateTransaction };