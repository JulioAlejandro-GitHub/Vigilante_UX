import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.db_host || '',
  port: parseInt(process.env.db_port || '', 10),
  user: process.env.db_user || '',
  password: process.env.db_password || '',
  database: process.env.db_database || '',
  connectionLimit: parseInt(process.env.db_limit || '', 10),
  waitForConnections: true,
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log(`Conectado exitosamente a la base de datos MySQL (${process.env.db_database})`);
    connection.release();
  })
  .catch(error => {
    console.error('Error al conectar a la base de datos:', error.message);
  });

export default pool;
