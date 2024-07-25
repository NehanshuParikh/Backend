import express from 'express';
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';

dotenv.config()
console.log("MONGO_URI: ", process.env.MONGO_URI)

const app = express()
const PORT = ENV_VARS.PORT


app.use(express.json()); // will allow us top parse req.body
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');


app.use('/api/v1/auth', authRoutes)

app.listen(PORT, ()=>{
    console.log('server started on', PORT)
    connectDB()
})