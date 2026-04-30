# 🚀 Sistema de Gestión de Usuarios - CLI (Node.js + MySQL)

Aplicación de línea de comandos (CLI) desarrollada en Node.js para gestionar usuarios (crear, listar, actualizar y eliminar) utilizando una base de datos MySQL.

---

## Características

* ✅ CRUD completo de usuarios
* ✅ Validación de datos (email, nombre y contraseña)
* ✅ Uso de MySQL como base de datos
* ✅ CLI mediante `process.argv`
* ✅ Interfaz mejorada en consola con `chalk` y `boxen`
* ✅ Código modular (controllers, config, index)

---

## Tecnologías utilizadas

* Node.js
* MySQL
* mysql2
* chalk
* boxen
* dotenv

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/danyelsalazar/Diplomatura-full-stack-backend-UTN.git
cd tp-1-backend-utn
```

---

### 2. Instalar dependencias

```bash
npm install
```

---

### 3. Configurar variables de entorno

Crear un archivo `.env` e la raiz de tp-1-backend-utn:

```env
HOST=
BD_USER=
PASSWORD=
DATABASE=usuarios_db
```

---

### 4. Crear la base de datos

Ejecutar en MySQL:

```sql
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
```

---

## ▶️ Uso de la aplicación

Ejecutar comandos desde la terminal:

```bash
npm run dev <operacion> [argumentos...]
```


---

## 📌 Comandos disponibles

###  🧾 Mostrar menu 
```bash
npm run dev
```

### ➕ Crear usuario

```bash
npm run dev add nombre email password
```

---

### 📦 Listar usuarios

```bash
npm run dev get
```

---

### 🔍 Buscar usuario por email

```bash
npm run dev getByEmail email
```

---

### ✏️ Actualizar usuario

```bash
npm run dev update nombre email password id
```

---

### 🗑️ Eliminar usuario

```bash
npm run dev delete id
```

---

### 🧹 Eliminar todos los usuarios

```bash
npm run dev resetclearTableUsers
```

---

### 🧪 Cargar usuarios de prueba

```bash
npm run dev addUsers
```

---

## 💡 Notas

* El email debe tener formato válido
* La contraseña debe tener:

  * mínimo 8 caracteres
  * al menos una mayúscula
  * al menos una minúscula
  * al menos un número
* El email es único en la base de datos

---

## 📁 Estructura del proyectoo

```
/tp-1-backend-utn
│── index.js        # Punto de entrada (CLI)
│── controllers.js  # Lógica del negocio
│── config.js       # Conexión a MySQL
│── .env            # Variables de entorno
```

---

## 👨‍💻 Autor

Desarrollado por Danyel Salazar

---

## 📄 Licencia

Este proyecto es de uso académico.
