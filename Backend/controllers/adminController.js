const User = require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

exports.getDashboard = async (req, res) => {
    try {

        const totalUsers = await User.count();

        const totalStores = await Store.count();

        const totalRatings = await Rating.count();

        return res.status(200).json({
            success: true,
            dashboard: {
                totalUsers,
                totalStores,
                totalRatings
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.addUser = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const {
            name,
            email,
            address,
            password,
            role
        } = req.body;

        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            name,
            email,
            address,
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            success: true,
            message: `${role} created successfully`,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            role,
            page = 1,
            limit = 10,
            sort = "name",
            order = "ASC"
        } = req.query;

        const where = {};

        if (name) {
            where.name = {
                [Op.like]: `%${name}%`
            };
        }

        if (email) {
            where.email = {
                [Op.like]: `%${email}%`
            };
        }

        if (address) {
            where.address = {
                [Op.like]: `%${address}%`
            };
        }

        if (role) {
            where.role = role;
        }

        const offset = (page - 1) * limit;

        const { rows, count } = await User.findAndCountAll({
            where,
            attributes: [
                "id",
                "name",
                "email",
                "address",
                "role",
                "createdAt"
            ],
            order: [[sort, order.toUpperCase()]],
            limit: Number(limit),
            offset: Number(offset)
        });

        return res.status(200).json({
            success: true,
            totalUsers: count,
            currentPage: Number(page),
            totalPages: Math.ceil(count / limit),
            users: rows
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: [
                "id",
                "name",
                "email",
                "address",
                "role"
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const response = user.toJSON();

        // If store owner, calculate average rating
        if (user.role === "OWNER") {
            const stores = await Store.findAll({
                where: { ownerId: user.id },
                attributes: ["id"]
            });

            const storeIds = stores.map(store => store.id);

            if (storeIds.length > 0) {
                const avgResult = await Rating.findOne({
                    attributes: [
                        [
                            require("sequelize").fn(
                                "AVG",
                                require("sequelize").col("rating")
                            ),
                            "averageRating"
                        ]
                    ],
                    where: {
                        storeId: storeIds
                    },
                    raw: true
                });

                response.averageRating = Number(
                    avgResult.averageRating || 0
                ).toFixed(2);
            } else {
                response.averageRating = "0.00";
            }
        }

        return res.status(200).json({
            success: true,
            user: response
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.getStores = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            page = 1,
            limit = 10,
            sort = "name",
            order = "ASC"
        } = req.query;

        const where = {};

        if (name) {
            where.name = {
                [Op.like]: `%${name}%`
            };
        }

        if (email) {
            where.email = {
                [Op.like]: `%${email}%`
            };
        }

        if (address) {
            where.address = {
                [Op.like]: `%${address}%`
            };
        }

        const { rows, count } =
            await Store.findAndCountAll({
                where,
                attributes: {
                    include: [
                        [
                            sequelize.literal(`
                                (
                                    SELECT ROUND(AVG(rating), 2)
                                    FROM Ratings
                                    WHERE Ratings.storeId = Store.id
                                )
                            `),
                            "averageRating"
                        ]
                    ]
                },
                order: [
                    [sort, order.toUpperCase()]
                ],
                limit: Number(limit),
                offset: (page - 1) * limit
            });

        return res.status(200).json({
            success: true,
            totalStores: count,
            currentPage: Number(page),
            totalPages: Math.ceil(
                count / limit
            ),
            stores: rows
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.addStore = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const {
            name,
            email,
            address,
            ownerId
        } = req.body;

        // Check if store email already exists
        const existingStore = await Store.findOne({
            where: { email }
        });

        if (existingStore) {
            return res.status(400).json({
                success: false,
                message: "Store email already exists"
            });
        }

        // Verify owner exists
        const owner = await User.findByPk(ownerId);

        if (!owner || owner.role !== "OWNER") {
            return res.status(400).json({
                success: false,
                message: "Invalid Store Owner"
            });
        }

        const store = await Store.create({
            name,
            email,
            address,
            ownerId
        });

        return res.status(201).json({
            success: true,
            message: "Store created successfully",
            store
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};