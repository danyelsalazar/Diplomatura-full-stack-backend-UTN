// aqui van los controladores de la aplicacion, es decir, las funciones que se encargan de manejar las peticiones y respuestas de la aplicacion, y que se conectan con la base de datos para realizar las operaciones necesarias.
import { log } from "console";
import { db } from "./config.js";
import crypto from "crypto"


// creamos el usuario
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


        // primero creamos la query
        const query = `
            INSERT INTO users (id, username, email, password)
            VALUES (?, ?, ?, ?);`;
        
        // insertamos el usuario en la base de datos:
        await db.query(query, [id, username, email, password] );

        console.log("✅Usuario creado");

        // cierro la conexion de la base de datos
        await db.end(); 

        return;

    } catch (error) {
        console.error("Error: ", error.message)
    }
}

// traemos usuario por correo email
const getUserByEmail = async(email)=>{
    try {
        const query = `
            SELECT * FROM users
            WHERE email LIKE ?;`

        const [rows] = await db.query(query, `%${email}%`);
       
        if(rows.length <= 0){
            return console.log('No se encontro el usuario');
        }

        console.log(rows)

        await db.end()

        return;
        

    } catch (error) {
        console.error("Error: ", error);
        
    }
}

// listamos los usuarios de la base de datos:

const getUsers = async()=>{
    try {
        const query = `SELECT * FROM users`

        const [rows] = await db.query(query)

        if(rows.length <= 0) return console.log("❌ No hay usuarios que mostrar");

        console.log(`---------------------------------------------
🗂️ Usarios de la base de datos: `, rows , `
---------------------------------------------`);

        // cierro la conexion de la base de datos
        await db.end(); 

        return;
        
    } catch (error) {
        console.error("❌ Error: ", error);
        
    }
}

// Actualizacion de datos de un usuario

const updateUser = async (datos) => {

    try {
        // console.log("entro");
        // console.log(datos); //verifico que este entrando la informacion correcta
        
        // verifico que haya tipeado los 3 datos
        if(!datos || datos.length < 4){
            return console.log(`---------------------------------------------
❌ Los datos estan incompletos. 
💡 Debes enviar ( nombre email password idDelUserAEditar)
---------------------------------------------`)
        }

        const query = `
        UPDATE users
            SET username = ?, 
                email = ?,
                password = ?
            WHERE id = ?;
        `
        const [results] = await db.query(query, datos)

        // cierro la conexion de la base de datos
        await db.end(); 

        return(
                console.log(`---------------------------------------------
✅ Usuarios actalizados de la base de datos: ${results.affectedRows}
ID: ${datos[datos.length-1]}
---------------------------------------------`)
        )

    } catch (error) {
        console.error("❌ Error: ", error);
    }
}



export {adduser, getUserByEmail, getUsers, updateUser}