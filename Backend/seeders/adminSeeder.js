const bcrypt = require("bcrypt");
const User = require("../models/User");

async function createAdmin() {
    const admin = await User.findOne({
        where: { email: "admin@example.com" }
    });

    if (!admin) {
        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        await User.create({
            name: "System Administrator",
            email: "admin@example.com",
            password: hashedPassword,
            address: "Head Office",
            role: "ADMIN"
        });

        console.log("Default admin created");
    }
}

module.exports = createAdmin;