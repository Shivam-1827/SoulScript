const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("DB connected successfully");
    } catch (error) {
        console.error("DB connection error", error);
        process.exit(1);
    }
};

module.exports = dbConnect;
