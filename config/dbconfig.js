import mysql from 'mysql2/promise';

const db = await mysql.createPool({
  host: 'localhost:3306',
  user: 'root',
  database: 'checkmate',
  password: "CoOg"
});


export default db