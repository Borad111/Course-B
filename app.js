const express = require('express');
const app=express();
const DB=require('./Config/DB');
const dotenv=require('dotenv');
const userRoute=require('./Routes/UserRoute')
const courseRoute=require('./Routes/Course.Route')
const mediaRoute=require('./Routes/MediaRoute')
const purchaseRoute=require('./Routes/Purchase.Route')
const CourseProgress=require('./Routes/CourseProgress.Route')
const cookie_parser=require('cookie-parser')
const cors=require('cors')

dotenv.config();
DB();


app.use(express.json());
app.use(cookie_parser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true  // enable setting of cookies in response headers
  }));



app.use("/api/v1/user",userRoute)
app.use("/api/v1/course",courseRoute)
app.use("/api/v1/media",mediaRoute)
app.use("/api/v1/purchase",purchaseRoute)
app.use("/api/v1/courseProgress",CourseProgress)






app.get('/home',(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"Welcome to the Home Page"
    })
})
const PORT= process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port  ${PORT}`);
 
})