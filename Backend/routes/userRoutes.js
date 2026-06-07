const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const authorize = require("../middleware/authorize");

const {
    getStores,
    submitRating
} = require("../controllers/userController");

const {
    submitRatingValidation
} = require("../validations/userValidation");

router.get(
    "/stores",
    verifyToken,
    authorize("USER"),
    getStores
);
router.post(
    "/stores/:storeId/rating",
    verifyToken,
    authorize("USER"),
    submitRatingValidation,
    submitRating
);

module.exports = router;