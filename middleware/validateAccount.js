const Joi = require("joi")

const accountSchema = Joi.object({
  userId: Joi.string().required(),
  bankName: Joi.string().min(2).max(50).required(),
  accountNumber: Joi.string().min(5).max(20).required(),
  accountType: Joi.string().valid("savings", "current", "wallet").required(),
  balance: Joi.number().min(0).optional(),
  currency: Joi.string().length(3).optional() // e.g., NGN, USD
});

const updateAccountSchema = Joi.object({
    balance: Joi.number().min(0).optional(),
    currency: Joi.string().length(3).optional(),
    accountType: Joi.string().valid("savings", "current", "wallet").optional()
}).min(1)

const validateAccount = (req, res, next) => {
    const { error } = accountSchema.validate(req.body, { abortEarly: true })
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    next()
}

const validateUpdateAccount = (req, res, next) => {
    const { error } = updateAccountSchema.validate(req.body, { abortEarly: true })
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    next()
}

module.exports = { validateAccount, validateUpdateAccount }