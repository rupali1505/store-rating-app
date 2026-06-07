const { body } = require("express-validator");

const addUserValidation = [
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
        ),

    body("role")
        .isIn(["ADMIN", "USER", "OWNER"])
        .withMessage("Role must be ADMIN, USER, or OWNER")
];

const addStoreValidation = [
    body("name")
        .trim()
        .isLength({ min: 1, max: 60 })
        .withMessage("Store name is required and cannot exceed 60 characters"),

    body("email")
        .isEmail()
        .withMessage("Please enter a valid store email"),

    body("address")
        .trim()
        .isLength({ min: 1, max: 400 })
        .withMessage("Address cannot exceed 400 characters"),

    body("ownerId")
        .isInt({ min: 1 })
        .withMessage("Valid ownerId is required")
];


module.exports = {
    addUserValidation,
    addStoreValidation
};