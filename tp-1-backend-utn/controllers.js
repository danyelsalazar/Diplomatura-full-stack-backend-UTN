import { db } from "./config.js";
import crypto from "crypto"

const adduser = async (username, email, password) =>{
    try {
        // validaciones:
        if(!username || !email || !password){
            throw new Error("todos los campos son obligatorios")
        }

        if(!email.endsWith("@gmail.com")){
            throw new Error("El mail debe ser @gmail.com")
        }
        if(password.length < 4){
            throw new Error("La contrasenia debe tener al menos 4 caracteres")
        }

        // generamos un id unico
        const id = crypto.randomUUID();

        // insertamos el usuario en la base de datos:

        // primero creamos la query
        const query = `
            INSERT INTO users (id, username, email, password)
            VALUES (?, ?, ?, ?);`;
        
        await db.query(query, [id, username, email, password] );

        console.log("✅ Usuario creado");

        // cierro la conexion de la base de datos
        await db.end(); 

        return;

    } catch (error) {
        console.error("Error: ", error.message)
    }
}

export {adduser}