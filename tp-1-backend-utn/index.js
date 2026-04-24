import { adduser } from "./controllers.js";

const args = process.argv
const datos = args.slice(2)


const main = async ()=>{

    await adduser(...datos)

    // cierro el proceso de node asi puedo seguir escribiendo
    process.exit()
    // console.log(...datos);
    
}


main()