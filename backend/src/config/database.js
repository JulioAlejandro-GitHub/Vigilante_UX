"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = promise_1.default.createPool({
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
exports.default = pool;
//# sourceMappingURL=database.js.map