const mongoose=require('mongoose');

const lectureProgressSchema=new mongoose.Schema({
    lectureId:{
        type:String
    },
    viewed:{
        type:Boolean,
        default:false
    },  
});

const CourseProgressSchema=new mongoose.Schema({
    userId:{
        type:String
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    },
    completed:{
        type:Boolean,
        default:false
    },
    lectureProgress:[
        lectureProgressSchema
    ]
    
})



module.exports=mongoose.model('CourseProgress',CourseProgressSchema);