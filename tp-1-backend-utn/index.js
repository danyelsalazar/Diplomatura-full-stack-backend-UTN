// aqui es el punto de entrada de la aplicacion, es decir, el archivo que se ejecuta cuando se corre el comando "npm run dev" en la terminal. En este archivo se parsean los argumentos de la linea de comandos para determinar que operacion se quiere realizar y se llama a la funcion correspondiente del controlador.

import { adduser , getUserByEmail, getUsers, updateUser, deleteUserById, addUsers} from "./controllers.js";

const args = process.argv
const datos = args.slice(3)
const operacion = args[2]

// aqui voy a poner unos usuarios de prueba asi tengo la opcion en el menu de cargar Usuarios de prueba para no escribir uno a uno para probar luego el sistema
const usuariosDePrueba = [
  {
    id: "01",
    username: "Marcus Antonio",
    email: "Marcus@gmail.com",
    password: "11111",
  },
  {
    id: "02",
    username: "laura_dev",
    email: "laura.dev@outlook.com",
    password: "Password123",
  },
  {
    id: "03",
    username: "marcos_fullstack",
    email: "m.fullstack@hotmail.com",
    password: "Admin789",
  },
  {
    id: "04",
    username: "sofia_coder",
    email: "sofia.coder@gmail.com",
    password: "Secret456",
  },
  {
    id: "05",
    username: "test_user_01",
    email: "test01@empresa.es",
    password: "User_2024",
  },
];


// aqiui empieza mi sistema

const main = async ()=>{

    // console.log("operacion:", operacion);
    // console.log("Datos: ", datos);

    switch(operacion){
        case "add":
            await adduser(...datos)
            break;
        case "getByEmail":
            await getUserByEmail(...datos)
            break;
        case "get":
            await getUsers()
            break;
        case "update":
            await updateUser(datos)
            break;
        case "delete":
            await deleteUserById(...datos)
            break;
        case "addUsers":
            await addUsers(usuariosDePrueba)
            break;
        default:
            console.log(`
==================================================
  🚀  SISTEMA DE GESTIÓN DE USUARIOS - UTN
==================================================

📝 MODO DE USO:
   npm run dev <operación> [argumentos...]

📌 OPERACIONES:
   ➕ add         ->  npm run dev  add Danyel danyel@gmail.com 1234
   ➕ addUsers    ->  npm run dev addUsers (Para cargar usuarios de prueba)
   🔍 getByEmail  ->  npm run dev  getByEmail danyel@gmail.com
   🔍 get         ->  npm run dev  get
   ✏️ update       ->  npm run dev update nuevoNombre nuevoEmail nuevoPassword idDelUsuarioAActualizar
   🗑️ delete       ->  npm run dev delete idUser
              
💡 Tip: Usa "comillas" para textos con espacios.
==================================================
`);
            break;
            
    }



    // cierro el proceso de node asi puedo seguir escribiendo
    process.exit()
    // console.log(...datos);
}


main()