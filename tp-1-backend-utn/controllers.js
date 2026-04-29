import { db } from "./config.js"; //la conexion de mi bdd
import crypto from "crypto"; //para un id aleatorio
//Darle estilos a mi consola:
import chalk from "chalk";
import boxen from "boxen";

// ----------------------------------
// los patrones que usare para validar los datos
// --------------------------------------
const patrones = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // este es un patron basico para validar el formato de un email, no es perfecto pero sirve para nuestro caso de uso
  name: /^[a-zA-ZÀ-ÿ\s]{3,40}$/, // este patron valida que el nombre solo contenga letras (mayusculas o minusculas) y espacios, y que tenga entre 3 y 40 caracteres
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, // este patron valida que la contrasenia tenga al menos 8 caracteres, al menos una letra mayuscula, al menos una letra minuscula y al menos un numero.
};


// -------------------------------------------------------------------------------------
// funciones de mensaje de error general para todos y uno para email que ya existe 
// ------------------------------------------------------------------------------------
const mensajeError = (error)=>{
    console.log(boxen(`❌ Error: ${error}`, {
            padding: 0.5,
            margin: 1,
            borderColor: "red",
            borderStyle: "round"
    }));
}

const mensajeErrorEmail = () =>{
    console.log(boxen(`❌ El email de usaurio ya existe en la base de datos`, {
            padding: 0.5,
            margin: 1,
            borderColor: "red",
            borderStyle: "round"
        }));
}


//------------------------------------------
// funcion para validar los datos de usuario
//-------------------------------------------

const validarDatos = (username, email, password)=>{
    // valido los campos y muestro el error 
    if (!patrones.name.test(username))
      throw new Error(`El nombre solo debe incluir:
- Letras. 
- Al menos 3 caractere.`);
    if (!patrones.email.test(email))
      throw new Error(`El email debe cumplir con el formato:  
(cracteres@caracteres.domino)`);
    if (!patrones.password.test(password))
      throw new Error(`La password debe cumplir con:
- Al menos 8 caracteres.
- Al menos una mayuscula.
- Al menos una minuscula. 
- Al menos un numero. `);
}

//---------------------------------------------
// ----------- creamos el usuario ---------------
//---------------------------------------------
const addUser = async (username, email, password) => {
  try {
    // validaciones:
    if (!username || !email || !password) {
      throw new Error("todos los campos son obligatorios");
    }
    
    // llamo a la funcion de validacion de datos:
    validarDatos(username, email, password)

    // generamos un id unico
    const id = crypto.randomUUID();

    // primero creamos la query
    const query = `
            INSERT INTO users (id, username, email, password)
            VALUES (?, ?, ?, ?);`;

    // insertamos el usuario en la base de datos:
    await db.query(query, [id, username, email, password]);

    console.log(boxen("✅ Usuario creado correctamente", {
            padding: 0.5,
            margin: 1,
            borderColor: "green",
            borderStyle: "round"
    }));

  } catch (error) {

    // si el email ya existe en la base de datos se lo hago saber al usuario
    if (error.code === 'ER_DUP_ENTRY') {
        mensajeErrorEmail()
    }else{
        mensajeError(error)
    }
  }
};

//---------------------------------------------------------------------------
//--------------- funcion para cargar usuarios de prueba ---------------
// ---------------------------------------------------------------------------

const addUsers = async (users) => {
  try {
    // usare un for of ya que por lo investigado es el mejor para recorrer en asincronia
    for (const user of users) {
      // hago la consulta
      const query = `INSERT INTO users (id, username, email, password)
        VALUES (?, ?, ?, ?);`;

      const [results] = await db.query(query, [user.id, user.username, user.email, user.password ]);
    }

    console.log(boxen("✅ Usuarios de prueba cargados correctamente", {
            padding: 0.5,
            margin: 1,
            borderColor: "green",
            borderStyle: "round"
    })); 

  } catch (error) {
        console.log(boxen(`❌ Error: Ya cargaste los usuarios de prueba`, {
            padding: 0.5,
            margin: 1,
            borderColor: "red",
            borderStyle: "round"
        }));
  }
};

// ------------------------------------------------------------
//--------------- traemos usuario por correo email ---------------
// ------------------------------------------------------------

const getUserByEmail = async (email) => {
  try {
    const query = `
            SELECT * FROM users
            WHERE email = ?;`;

    const [rows] = await db.query(query, [email]);

    if (rows.length <= 0) {
      throw new Error("No se encontro el usuario");
    }

    console.table(rows);

  } catch (error) {
        mensajeError(error)
    };
}

// ---------------------------------------------------------------------------
//--------------- listamos los usuarios de la base de datos: ---------------
// ---------------------------------------------------------------------------

const getUsers = async () => {
  try {
    const query = `SELECT * FROM users`;

    const [rows] = await db.query(query);

    if (rows.length <= 0) {
      throw new Error("No hay usuarios que mostrar");
    }

    console.table(rows) //asi mostramos una tabala ordenada para todos mis datos de la bdd

  } catch (error) {
        mensajeError(error)
  }
};

// ------------------------------------------------------------
//--------------- Actualizacion de datos de un usuario ---------------
// ------------------------------------------------------------

const updateUser = async (username, email, password, id) => {
  try {
    // verifico que haya tipeado los 3 datos
    if (!username || !password || !id) {
      throw new Error(`Los datos estan incompletos. 
💡 Debes enviar ( nombre email password idDelUserAEditar)`);
    }

    validarDatos(username, email, password) //valido los nuevos datos 

    const query = `
        UPDATE users
            SET username = ?, 
                email = ?,
                password = ?
            WHERE id = ?;
        `;
    const [results] = await db.query(query, [username, email, password, id]);

    // verifico si se actualizo el usuario, si no se actualizo eso quiere decir que el id no pertenece a ningun ususario registrado en la base de datos
    if (results.affectedRows <= 0) {
      // aviso que no se encontro el usuario
      throw new Error(`El id ingresado no pertenece a ningun usuario registrado en la base de datos`,
      );
    }

    console.log(boxen(`✅ Usuarios actalizados de la base de datos: ${results.affectedRows}`, {
            padding: 0.5,
            margin: 1,
            borderColor: "green",
            borderStyle: "round"
        }))

  } catch (error) {
    // si el email ya existe entonces le hago saber al usuario
    if (error.code === 'ER_DUP_ENTRY') {
        mensajeErrorEmail()
    }else{
        mensajeError(error)
    }
  }
};

// ------------------------------------------------------------
// --------------- eliminar usuario por id ---------------
// ------------------------------------------------------------

const deleteUserById = async (id) => {
  try {
    // verifico que haya enviado un id
    if (!id) {
      throw new Error("Debes ingresar un id de usuario");
    }

    // hago la query a la base de datos
    const query = `DELETE FROM users WHERE id = ?;`;
    const [results] = await db.query(query, [id]); //obtengo los resultados de la query y asi puedo ver la cantidad de filas afectadas para sabe si elimine o no usuario

    // en caso de que las filas afectadas se  0 o menos a 0 entonces significa que el id no corresponde a ningun usuario , asi que lo informo
    if (results.affectedRows <= 0) {
      throw new Error(
        "El id no corresponde a ningun usuario registrado en la base de datos.",
      );
    }

    // si la query tiene fila afectada entonces si elimino al usuario asi que lo infomo
    console.log(boxen(`✅ Usuario con id: ${id} eliminado correctamente.`, {
            padding: 0.5,
            margin: 1,
            borderColor: "green",
            borderStyle: "round"
        }))

  } catch (error) {
        mensajeError(error)
  }
};

// ------------------------------------------------------------
// --------------- Resetear base de datos ---------------
// ------------------------------------------------------------

const clearUsersTable = async () => {
  try {
    const [result] = await db.query("DELETE FROM users;"); //elimino los datos de la tabla users

    console.log(
      boxen(`🧹 Se eliminaron ${result.affectedRows} usuarios`, {
        padding: 0.5,
        margin: 1,
        borderColor: "yellow",
        borderStyle: "round"
      })
    );

  } catch (error) {
    mensajeError(error)
  }
};

export { addUser, getUserByEmail, getUsers, updateUser, deleteUserById, addUsers, clearUsersTable };
