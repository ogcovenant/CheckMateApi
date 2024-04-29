import mysql from 'mysql2/promise';
import dotenv from "dotenv"

dotenv.config()

const db = await mysql.createConnection({
    host: process.env.DATABASE_URL,
    user: "root",
    database: 'checkmate',
    password: "CoOg"
});

export default db