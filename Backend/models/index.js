const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

/* Store Owner */
User.hasMany(Store, {
    foreignKey: "ownerId"
});

Store.belongsTo(User, {
    as: "owner",
    foreignKey: "ownerId"
});

/* Ratings */
User.hasMany(Rating, {
    foreignKey: "userId"
});

Rating.belongsTo(User, {
    foreignKey: "userId"
});

Store.hasMany(Rating, {
    foreignKey: "storeId"
});

Rating.belongsTo(Store, {
    foreignKey: "storeId"
});

module.exports = {
    User,
    Store,
    Rating
};