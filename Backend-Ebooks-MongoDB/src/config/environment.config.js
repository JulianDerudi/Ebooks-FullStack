import dotenv from 'dotenv';

dotenv.config();

const ENVIRONMENT = {
    MONGO_DB_URI: process.env.MONGO_DB_URI,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    PORT: process.env.PORT || 3000
};

export default ENVIRONMENT;