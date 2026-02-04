import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;

const connectionPool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

console.log("Database URL (masked):", process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:([^@]+)@/, ":****@") : "undefined");

export default connectionPool;
