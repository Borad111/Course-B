const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        reuired:[true,"name is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
    role:{
        type:String,
        enum:['student', 'admin'],
        default:'student'
    },
    enrollCourses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    }],
    photoURL:{
        type:String,
        default:''
    }
},{timestamps:true})

module.exports=mongoose.model('User',UserSchema)