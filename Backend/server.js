require("dotenv").config();
const createAdmin = require("./seeders/adminSeeder");

const app = require("./app");
const sequelize = require("./config/database");
require("./models");

const PORT = process.env.PORT || 5000;

sequelize.sync()
    .then(async () => {
        console.log("Database synchronized");

        await createAdmin();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(console.error);