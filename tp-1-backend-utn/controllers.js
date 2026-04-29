// aqui van los controladores de la aplicacion, es decir, las funciones que se encargan de manejar las peticiones y respuestas de la aplicacion, y que se conectan con la base de datos para realizar las operaciones necesarias.
import { log } from "console";
import { db } from "./config.js";
import crypto from "crypto";

/* aqui voy a tener mis patros dse email , nombre y password para validar los datos que 
me llegan por la linea de comandos antes de hacer cualquier operacion con la base de datos, 
asi evito hacer consultas innecesarias a la base de datos y ademas puedo asegurarme de que los 
datos que se van a insertar o actualizar en la base de datos cumplen con ciertos requisitos de formato y seguridad.
*/
const patrones = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // este es un patron basico para validar el formato de un email, no es perfecto pero sirve para nuestro caso de uso
  name: /^[a-zA-ZÀ-ÿ\s]{3,40}$/, // este patron valida que el nombre solo contenga letras (mayusculas o minusculas) y espacios, y que tenga entre 3 y 40 caracteres, ademas incluye letras con acentos y caracteres especiales de algunos idiomas
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, // este patron valida que la contrasenia tenga al menos 8 caracteres, al menos una letra mayuscula, al menos una letra minuscula y al menos un numero, ademas no permite caracteres especiales para evitar problemas de inyeccion de codigo o caracteres no permitidos en la base de datos
};



// funsion para validar los datos de usuario

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
- Al menos un numero. 
- No permite carecteres especiales.`);
}

//---------------------------------------------
// ----------- creamos el usuario ---------------
//---------------------------------------------
const adduser = async (username, email, password) => {
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

    console.log("✅Usuario creado");

    return true;
  } catch (error) {

    // si el email ya existe en la base de datos se lo hago saber al usuario
    if (error.code === 'ER_DUP_ENTRY') {
        console.error(`---------------------------------------------
❌ Error: El email de usuario ya existe.
---------------------------------------------`);
    }else{
        console.error(`---------------------------------------------
❌ Error: ${error.message}
---------------------------------------------`);
    }
  } finally {
    // siempre sierro la conexion
    await db.end();
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

    console.log(`---------------------------------------------
✅ Usuarios de prueba cargados correctamente.
---------------------------------------------`);    
  } catch (error) {
    console.error(`---------------------------------------------
❌ Error: ${error}
---------------------------------------------`)
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

    const [rows] = await db.query(query, email);

    if (rows.length <= 0) {
      throw new Error("No se encontro el usuario");
    }

    console.log(rows);

    return;
  } catch (error) {
    console.error(`---------------------------------------------
❌ Error: ${error.message}
---------------------------------------------`);
  } finally {
    // siempre sierro la conexion
    await db.end();
  }
};


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

    console.log(
      `---------------------------------------------
🗂️ Usarios de la base de datos: `,
      rows,
      `
---------------------------------------------`,
    );

    return true;
  } catch (error) {
    console.error(`---------------------------------------------
❌ Error: ${error.message}
---------------------------------------------`);
  } finally {
    await db.end();
  }
};

// ------------------------------------------------------------
//--------------- Actualizacion de datos de un usuario ---------------
// ------------------------------------------------------------

const updateUser = async (datos) => {
  try {
    // console.log("entro");
    // console.log(datos); //verifico que este entrando la informacion correcta

    // verifico que haya tipeado los 3 datos
    if (!datos || datos.length < 4) {
      throw new Error(`Los datos estan incompletos. 
💡 Debes enviar ( nombre email password idDelUserAEditar)`);
    }

    const query = `
        UPDATE users
            SET username = ?, 
                email = ?,
                password = ?
            WHERE id = ?;
        `;
    const [results] = await db.query(query, datos);

    // verifico si se actualizo el usuario, si no se actualizo eso quiere decir que el id no pertenece a ningun ususario registrado en la base de datos
    if (results.affectedRows <= 0) {
      // aviso que no se encontro el usuario
      throw new Error(
        `❌ El id ingresado no pertenece a ningun usuario registrado en la base de datos`,
      );
    }

    console.log(`---------------------------------------------
✅ Usuarios actalizados de la base de datos: ${results.affectedRows}
ID: ${datos[datos.length - 1]}
---------------------------------------------`);
    return true;
  } catch (error) {
    // si el email ya existe entonces le hago saber al usuario
    if (error.code === 'ER_DUP_ENTRY') {
        console.error(`---------------------------------------------
❌ Error: El email de usuario ya existe.
---------------------------------------------`);
    }else{
        console.error(`---------------------------------------------
❌ Error: ${error.message}
---------------------------------------------`);
    }
  } finally {
    await db.end();
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
    const [results] = await db.query(query, id); //obtengo los resultados de la query y asi puedo ver la cantidad de filas afectadas para sabe si elimine o no usuario

    // en caso de que las filas afectadas se  0 o menos a 0 entonces significa que el id no corresponde a ningun usuario , asi que lo informo
    if (results.affectedRows <= 0) {
      throw new Error(
        "El id no corresponde a ningun usuario registrado en la base de datos.",
      );
    }

    // si la query tiene fila afectada entonces si elimino al usuario asi que lo infomo
    console.log(`---------------------------------------------
✅ Usuario con id: ${id} eliminado correctamente.
---------------------------------------------`);
  } catch (error) {
    console.error(`---------------------------------------------
❌ Error: ${error.message}
---------------------------------------------`);
  } finally {
    await db.end();
  }
};

export { adduser, getUserByEmail, getUsers, updateUser, deleteUserById, addUsers };
