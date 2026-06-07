const { Store, Rating, User } = require("../models");

exports.getDashboard = async (req, res) => {
    try {
        // Get stores owned by logged-in owner
        const stores = await Store.findAll({
            where: {
                ownerId: req.user.id
            }
        });

        const storeIds = stores.map(store => store.id);

        if (storeIds.length === 0) {
            return res.status(200).json({
                success: true,
                averageRating: 0,
                ratings: []
            });
        }

        const ratings = await Rating.findAll({
            where: {
                storeId: storeIds
            },
            include: [
                {
                    model: User,
                    attributes: ["name", "email"]
                },
                {
                    model: Store,
                    attributes: ["name"]
                }
            ]
        });

        let total = 0;

        const result = ratings.map(rating => {
            total += rating.rating;

            return {
                userName: rating.User.name,
                userEmail: rating.User.email,
                storeName: rating.Store.name,
                rating: rating.rating
            };
        });

        const averageRating =
            ratings.length > 0
                ? Number(
                    (total / ratings.length).toFixed(2)
                )
                : 0;

        return res.status(200).json({
            success: true,
            averageRating,
            ratings: result
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};