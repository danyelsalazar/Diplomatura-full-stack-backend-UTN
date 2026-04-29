/* Crteamos la base de datos */
CREATE DATABASE usuarios_db;
USE usuarios_db;

/* Creamos la tabala users */

CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(100)
);