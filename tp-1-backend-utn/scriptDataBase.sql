/* Crear base de datos */
CREATE DATABASE IF NOT EXISTS usuarios_db;

USE usuarios_db;

/* Crear tabla */
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100)
);