const { body, validationResult } = require("express-validator");

// Custom validation rules
const registerValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),

    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isAlphanumeric().withMessage("Username can only contain letters and numbers"),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),

    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .matches(/[\W_]/).withMessage("Password must contain at least one special character")
];

// Middleware to check validation and return the first error only
const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0].msg;
        res.cookie("flash_message", firstError, { maxAge: 5000 });
        return res.redirect("/register");
    }
    next();
};

module.exports = { registerValidator, checkValidation };
