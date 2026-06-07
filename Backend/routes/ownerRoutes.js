const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const authorize = require("../middleware/authorize");

const {
    getDashboard
} = require("../controllers/ownerController");

router.get(
    "/dashboard",
    verifyToken,
    authorize("OWNER"),
    getDashboard
);

module.exports = router;