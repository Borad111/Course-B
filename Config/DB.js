const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const ConnectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB Connected...');
    }catch(error){
        console.log("error in Connection" , error.message)
    }
}

module.exports=ConnectDB;