const mongoose=require('mongoose');

const LectureSchema=new mongoose.Schema({
    lectureTitle:{
        type:String,
        required:[true,"lecture title is required"]
    },
    vidioUrl:{
        type:String,
    },
    publicId:{
        type:String
    },
    isPreviewFree:{
        type:Boolean,
        default:false
    }
},{timestamps:true})


module.exports=mongoose.model('Lecture',LectureSchema)