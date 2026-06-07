const { body } = require("express-validator");

const signupValidation = [
    body("name")
        .trim()
        .isLength({ min: 20, max: 60 })
        .withMessage("Name must be between 20 and 60 characters"),

    body("email")
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("address")
        .isLength({ max: 400 })
        .withMessage("Address cannot exceed 400 characters"),

    body("password")
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/)
        .withMessage(
            "Password must be 8-16 characters and include one uppercase letter and one special character"
        )
];

const loginValidation = [
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
];

const changePasswordValidation = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),

    body("newPassword")
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/)
        .withMessage(
            "New password must be 8-16 characters and include one uppercase letter and one special character"
        )
];

module.exports = {
    signupValidation,
    loginValidation,
    changePasswordValidation
};