//database cnnection modules import
import mysql from 'mysql2/promise';
import dotenv from "dotenv"

//database configurations
dotenv.config()

//establishing connection to database
const db = await mysql.createConnection({
    host: process.env.DATABASE_URL,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD
});

//exporting the database connection
export default db