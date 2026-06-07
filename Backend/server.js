require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
    .then(() => {
        console.log("MySQL Connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed");
        console.error(error.message);
    });