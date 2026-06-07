const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const authorize = require("../middleware/authorize");

/* Any logged-in user */
router.get(
    "/profile",
    verifyToken,
    (req, res) => {
        res.json({
            success: true,
            message: "Protected route accessed",
            user: req.user
        });
    }
);

/* Admin only */
router.get(
    "/admin",
    verifyToken,
    authorize("ADMIN"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Admin"
        });
    }
);

/* Normal User only */
router.get(
    "/user",
    verifyToken,
    authorize("USER"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome User"
        });
    }
);

/* Store Owner only */
router.get(
    "/owner",
    verifyToken,
    authorize("OWNER"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Store Owner"
        });
    }
);

module.exports = router;