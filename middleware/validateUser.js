const Joi = require("joi")

// Base reusable fields
const baseUserFields = {
    firstName: Joi.string().trim().min(3).max(50).messages({
        "string.empty": "First name cannot be empty",
        "string.base": "First name must be a string",
        "string.min": "First name must be at least 3 characters"
    }),

    lastName: Joi.string().trim().min(3).max(50).messages({
        "string.empty": "Last name cannot be empty",
        "string.base": "Last name must be a string",
        "string.min": "Last name must be at least 3 characters"
    }),

    email: Joi.string().trim().email().lowercase().messages({
        "string.empty": "Email cannot be empty",
        "string.email": "Email must be valid",
        "string.base": "Email must be a string"
    }),

    password: Joi.string().min(6).messages({
        "string.empty": "Password cannot be empty",
        "string.base": "Password must be a string",
        "string.min": "Password must be at least 6 characters"
    }),

    role: Joi.string().valid("admin", "user"),

    phone: Joi.string()
        .pattern(/^[0-9+]{10,15}$/)
        .messages({
            "string.pattern.base": "Phone number must be valid",
            "string.empty": "Phone number cannot be empty"
        }),

    address: Joi.string().trim().messages({
        "string.empty": "Address cannot be empty",
        "string.base": "Address must be a string"
    })
}

// Create User Schema (ALL required except role & phone)
const userSchema = Joi.object({
    firstName: baseUserFields.firstName.required().messages({
        "any.required": "First name is required"
    }),

    lastName: baseUserFields.lastName.required().messages({
        "any.required": "Last name is required"
    }),

    email: baseUserFields.email.required().messages({
        "any.required": "Email is required"
    }),

    password: baseUserFields.password.required().messages({
        "any.required": "Password is required"
    }),

    role: baseUserFields.role.optional(),

    phone: baseUserFields.phone.optional(),

    address: baseUserFields.address.required().messages({
        "any.required": "Address is required"
    })
})

// Update User Schema (ALL optional but at least one required)
const updateUserSchema = Joi.object({
    firstName: baseUserFields.firstName.optional(),
    lastName: baseUserFields.lastName.optional(),
    email: baseUserFields.email.optional(),
    password: baseUserFields.password.optional(),
    role: baseUserFields.role.optional(),
    phone: baseUserFields.phone.optional(),
    address: baseUserFields.address.optional()
}).min(1)


// Middleware: Create User
const validateUser = (req, res, next) => {
    const { error, value } = userSchema.validate(req.body, {
        abortEarly: true,
        stripUnknown: true
    })

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    req.body = value // sanitized data
    next()
}


// Middleware: Update User
const validateUpdateUser = (req, res, next) => {
    const { error, value } = updateUserSchema.validate(req.body, {
        abortEarly: true,
        stripUnknown: true
    })

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    req.body = value // sanitized data
    next()
}

module.exports = {
    validateUser,
    validateUpdateUser
}