import { adduser , getUserByEmail} from "./controllers.js";

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
        default:
            console.log(`
==================================================
  🚀  SISTEMA DE GESTIÓN DE USUARIOS - UTN
==================================================

📝 MODO DE USO:
   npm run dev <operación> [argumentos...]

📌 OPERACIONES:
   ➕ add         -> npm run dev  add Danyel danyel@gmail.com 1234
   🔍 getByUser  -> npm run dev  getByUser danyel@gmail.com
   📋 getUsers   -> npm run dev  getUsers

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