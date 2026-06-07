const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const authorize = require("../middleware/authorize");

const {
    getDashboard,
    addUser,
    getUsers,
    getUserById,
    getStores,
    addStore
} = require("../controllers/adminController");

const {
    addUserValidation,
    addStoreValidation
} = require("../validations/adminValidation");

router.get(
    "/dashboard",
    verifyToken,
    authorize("ADMIN"),
    getDashboard
);
router.post(
    "/users",
    verifyToken,
    authorize("ADMIN"),
    addUserValidation,
    addUser
);
router.get(
    "/users",
    verifyToken,
    authorize("ADMIN"),
    getUsers
);
router.get(
    "/users/:id",
    verifyToken,
    authorize("ADMIN"),
    getUserById
);
router.get(
    "/stores",
    verifyToken,
    authorize("ADMIN"),
    getStores
);
router.post(
    "/stores",
    verifyToken,
    authorize("ADMIN"),
    addStoreValidation,
    addStore
);

module.exports = router;