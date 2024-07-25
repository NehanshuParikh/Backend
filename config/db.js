import mongoose from "mongoose";
import { ENV_VARS } from "./envVars.js";

export const connectDB = async ()=>{
    try {
        const con = await mongoose.connect(ENV_VARS.MONGO_URI)
        console.log("MOngo DB COnnnected: ",con.connection.host)
    } catch (error) {
        console.error("Error while connecting to the mongo db: This is the error message: ", error.message)
        process.exit(1) // 1 means there was an error and 0 means success
    }
}