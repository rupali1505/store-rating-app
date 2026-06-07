const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
    signup,
    login,
    changePassword

} = require("../controllers/authController");

const {
    signupValidation,
    loginValidation,
    changePasswordValidation
} = require("../validations/authValidation");

router.post(
    "/signup",
    signupValidation,
    signup
);

router.post(
    "/login",
    loginValidation,
    login
);

router.put(
    "/change-password",
    verifyToken,
    changePasswordValidation,
    changePassword
);

module.exports = router;