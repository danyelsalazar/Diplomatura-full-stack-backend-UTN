// aqui configuro la conexion a la base de datos, utilizando las variables de entorno que se encuentran en el archivo .env
import "dotenv/config"
import mysql from "mysql2/promise";

const db = mysql.createPool({
    host: process.env.HOST || "127.0.0.1",
    user: process.env.BD_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

export {db}