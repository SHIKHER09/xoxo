
import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import adminRoutes from './Routes/admin.js'
import authRoutes from './Routes/auth.js'
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();
dotenv.config()
 
const connect = () => {
    mongoose.connect(process.env.MONGO)
        .then(() => {
            console.log("connected to db");
        })
}


app.use(cookieParser())
app.use(express.json());

app.get('/available-time-slots', (req, res) => {
  // Get available time slots from your database or define them here
  const availableTimeSlots = ["09:00 AM", "10:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

  res.status(200).json({ timeSlots: availableTimeSlots });
});

//  app.use('/',(req,res)=>{
//     res.json({msg:"hello abhishek"})
//  });
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

app.use(cors()); 

app.listen(8080,(req,res,next) => {
    try {connect()
    console.log("connected to server")}
    catch (err) {
        next(err);
    }
}) 
