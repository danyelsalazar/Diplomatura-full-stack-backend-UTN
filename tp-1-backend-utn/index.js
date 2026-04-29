// aqui es el punto de entrada de la aplicacion, es decir, el archivo que se ejecuta cuando se corre el comando "npm run dev" en la terminal. En este archivo se parsean los argumentos de la linea de comandos para determinar que operacion se quiere realizar y se llama a la funcion correspondiente del controlador.

import boxen from "boxen";
import chalk from "chalk";
import { addUser , getUserByEmail, getUsers, updateUser, deleteUserById, addUsers, clearUsersTable} from "./controllers.js";

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

// aqui preparo el diseno para mi consola uso template string asi no armo todo en el console directo parta que no se vea muy cargado en switch : 

const titulo = chalk.bold.blue("🚀 SISTEMA DE GESTIÓN DE USUARIOS - UTN");

const contenido = `
${chalk.yellow("📝 MODO DE USO:")}
  ${chalk.cyan("npm run dev <operación> [argumentos...]")}

${chalk.yellow("📌 OPERACIONES:")}

${chalk.green("➕ add")}
  ${chalk.gray("npm run dev add Danyel danyel@gmail.com 1234")}

${chalk.green("➕ addUsers")}
  ${chalk.gray("npm run dev addUsers")}
  ${chalk.dim("(Carga usuarios de prueba)")}

${chalk.blue("🔍 getByEmail")}
  ${chalk.gray("npm run dev getByEmail danyel@gmail.com")}

${chalk.blue("🔍 get")}
  ${chalk.gray("npm run dev get")}

${chalk.magenta("✏️ update")}
  ${chalk.gray("npm run dev update nuevoNombre nuevoEmail nuevoPassword id")}

${chalk.red("🗑️ delete")}
  ${chalk.gray("npm run dev delete idUser")}

${chalk.red("🗑️ clearTableUsers")}
  ${chalk.gray("npm run dev clearTableUsers")}
  ${chalk.yellow("(Elimina los datos de la tabala users)")}

${chalk.yellow("💡 Tip:")}
  ${chalk.dim('Usa "comillas" para textos con espacios')}
`;


// aqiui empieza mi sistema

const main = async ()=>{

    // console.log("operacion:", operacion);
    // console.log("Datos: ", datos);

    switch(operacion){
        case "add":
            await addUser(...datos)
            break;
        case "getByEmail":
            await getUserByEmail(...datos)
            break;
        case "get":
            await getUsers()
            break;
        case "update":
            await updateUser(...datos)
            break;
        case "delete":
            await deleteUserById(...datos)
            break;
        case "addUsers":
            await addUsers(usuariosDePrueba)
            break;
        case "clearTableUsers":
            await clearUsersTable()
            break;
        default:
            console.log(
                boxen(`${titulo}\n${contenido}`, {
                    padding: 0.5,
                    margin:1,
                    borderStyle: "round",
                    borderColor: "blue"
                })
            )
            break;
    }

    // cierro el proceso de node asi puedo seguir escribiendo
    process.exit()
    // console.log(...datos);
}


main()