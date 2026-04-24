import { adduser , getUserByEmail, getUsers} from "./controllers.js";

const args = process.argv
const datos = args.slice(3)
const operacion = args[2]


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
        default:
            console.log(`
==================================================
  🚀  SISTEMA DE GESTIÓN DE USUARIOS - UTN
==================================================

📝 MODO DE USO:
   npm run dev <operación> [argumentos...]

📌 OPERACIONES:
   ➕ add         -> npm run dev  add Danyel danyel@gmail.com 1234
   🔍 getByEmail  -> npm run dev  getByEmail danyel@gmail.com
   📋 get   -> npm run dev  get

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