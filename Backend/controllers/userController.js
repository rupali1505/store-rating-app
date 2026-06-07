const { Op } = require("sequelize");
const sequelize = require("../config/database");
const { validationResult } = require("express-validator");

const Store = require("../models/Store");
const Rating = require("../models/Rating");


exports.getStores = async (req, res) => {
    try {
        const {
            name,
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

        if (address) {
            where.address = {
                [Op.like]: `%${address}%`
            };
        }

        const offset =
            (page - 1) * Number(limit);

        const { rows, count } =
            await Store.findAndCountAll({
                where,
                order: [
                    [sort, order.toUpperCase()]
                ],
                limit: Number(limit),
                offset
            });

        const stores = await Promise.all(
            rows.map(async (store) => {

                const avg =
                    await Rating.findOne({
                        attributes: [
                            [
                                sequelize.fn(
                                    "AVG",
                                    sequelize.col("rating")
                                ),
                                "avgRating"
                            ]
                        ],
                        where: {
                            storeId: store.id
                        },
                        raw: true
                    });

                const userRating =
                    await Rating.findOne({
                        where: {
                            userId: req.user.id,
                            storeId: store.id
                        },
                        attributes: ["rating"]
                    });

                return {
                    id: store.id,
                    name: store.name,
                    address: store.address,
                    overallRating: Number(
                        avg?.avgRating || 0
                    ).toFixed(2),

                    userRating:
                        userRating?.rating || null
                };
            })
        );

        return res.status(200).json({
            success: true,
            totalStores: count,
            currentPage: Number(page),
            totalPages: Math.ceil(
                count / limit
            ),
            stores
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.submitRating = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { storeId } = req.params;
        const { rating } = req.body;

        // Check store exists
        const store = await Store.findByPk(storeId);

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        // Check if user already rated
        const existingRating =
            await Rating.findOne({
                where: {
                    userId: req.user.id,
                    storeId
                }
            });

        if (existingRating) {
            existingRating.rating = rating;

            await existingRating.save();

            return res.status(200).json({
                success: true,
                message: "Rating updated successfully",
                rating: existingRating
            });
        }

        // Create new rating
        const newRating =
            await Rating.create({
                userId: req.user.id,
                storeId,
                rating
            });

        return res.status(201).json({
            success: true,
            message: "Rating submitted successfully",
            rating: newRating
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};