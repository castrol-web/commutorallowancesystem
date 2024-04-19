import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import   userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
//cross origin for frontend-backend communication
app.use(cors({
    origin:["http://localhost:3001"],
    methods:['GET','PUT','POST','DELETE'],
    credentials: true
}));

app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);

//bodyparser to get user inputs
app.use(bodyParser.json());


//ejs view engine 
app.set("view engine","ejs");
const PORT = process.env.PORT || 8050 

//Database configurations
const connection_url = process.env.MONGOOSE_CONNECTION;
try{
await mongoose.connect(connection_url)
  console.log("DB connection successful");
}catch (error){
console.log(error)
process.exit(1);
}




//listening port 
app.listen(PORT,'0.0.0.0',function(err){
    if(err){
        console.log(err);
    }
    console.log(`listening on localhost:${PORT}`);
});