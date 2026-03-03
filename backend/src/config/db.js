import mongoose from 'mongoose';


export const conectarDB = async ()=>{
    try{
        const conexion = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB conectado con:${conexion.connection.host}`);
        console.log(`Base de datos: ${conexion.connection.name}`);    
    } catch (error){
        console.log(error.message);
        process.exit(1);
    }
};
