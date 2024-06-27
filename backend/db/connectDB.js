import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex : true
        });
        console.log(`mongoDB Connected : ${conn.connection.host}`)
    } catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }


};

export default connectDB