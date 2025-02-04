const mongoose=require('mongoose');
const PurchaseSchema=new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    amount:{
         type:Number,
         required:true
     },
     Status:{
        type:String,
        default:'pending'
     },
     paymentId:{
        type:String,
        required:true
     }

},{timestamps:true});



module.exports=mongoose.model('PurchaseCourse',PurchaseSchema)