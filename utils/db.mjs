import dotenv from "dotenv";
dotenv.config();
import * as pg from "pg";

const { connectionPool } = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default connectionPool
