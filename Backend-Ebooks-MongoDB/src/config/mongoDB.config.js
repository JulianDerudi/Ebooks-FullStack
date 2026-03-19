import mongoose from "mongoose";
import ENVIRONMENT from "./environment.config.js";

async function connectToMongoDB() {
    try {
        await mongoose.connect(ENVIRONMENT.MONGO_DB_URI + '/' + ENVIRONMENT.MONGO_DB_NAME);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

export default connectToMongoDB;