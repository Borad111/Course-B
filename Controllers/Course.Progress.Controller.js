const courseProgressModel = require("../Models/CourseProgressModel");
const CourseModel = require("../Models/CourseModel");
const GetCourseProgress = async (req, res) => { 
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    let courseProgress = await courseProgressModel
      .findOne({ courseId, userId })
      .populate("courseId");

    const CourseDetail = await CourseModel.findById(courseId).populate("lectures");

    if (!CourseDetail) {
      return res.status(404).json({
        succcess: false,
        message: "Course Not Found",
      });
    }

    if (!courseProgress) {
      return res.status(200).json({
        succcess: true,
        data: {
          CourseDetail,
          progress: [],
          completed: false,
        },
      });
    }

    return res.status(200).json({
      succcess: true,
      data: {
        CourseDetail,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    return res.status(500).json({
      succcess: false,
      message: "Error in Get Course Progress",
      error: error.message,
    });
  }
};


const UpdateLectureProgress=async(req,res)=>{
    try {
        const {lectureId,courseId}=req.params;
        const userId=req.userId;

        let courseProgress=await courseProgressModel.findOne({courseId,userId});
        if(!courseProgress){
            courseProgress=new courseProgressModel({
                courseId,
                userId,
                completed:false,
                lectureProgress:[]
            })
        }
        const  lectureIndex=courseProgress.lectureProgress.findIndex((lecture)=>lecture.lectureId===lectureId)
        
        if(lectureIndex!==-1){
            courseProgress.lectureProgress[lectureIndex].viewed=true;
        }else{
            courseProgress.lectureProgress.push({
                lectureId,
                viewed:true
            })
        }

        //if All Lecture Completed
        const lectureProgressLength=courseProgress.lectureProgress.filter((lectureprog)=>lectureprog.viewed).length;
        const CourseDetail=await CourseModel.findById(courseId);    
        if(lectureProgressLength===CourseDetail.lectures.length){
            courseProgress.completed=true;
        }

        await courseProgress.save();

        return res.status(200).json({
            success:true,
            message:"Lecture Progress Updated Successfully",
            data:courseProgress
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Error in Update Lecture Progress",
            error: error.message,
        })
    }
}

const markAsCompleted=async(req,res)=>{
    try {
        const {courseId}=req.params;
        const userId=req.userId;

        const courseProgress=await courseProgressModel.findOne({courseId,userId});
        if(!courseProgress){
            return res.status(404).json({
                success: false,
                message: "Course Progress Not Found",
            })
        }

        courseProgress.lectureProgress.map((lectureProg)=>lectureProg.viewed=true);
        courseProgress.completed=true;
        await courseProgress.save();

        return res.status(200).json({
            success: true,
            message: "Course Marked As Completed Successfully",
            data: courseProgress
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Mark As Completed",
            error: error.message,
        })
    }
}

const MarkAsUncompleted=async(req,res)=>{
    try {
        const {courseId}=req.params;
        const userId=req.userId;

        const courseProgress=await courseProgressModel.findOne({courseId,userId});
        if(!courseProgress){
            return res.status(404).json({
                success: false,
                message: "Course Progress Not Found",
            })
        }

        courseProgress.lectureProgress.map((lecture)=>lecture.viewed=false);
        courseProgress.completed=false;
        await courseProgress.save();

        return res.status(200).json({
            success: true,
            message: "Course Marked As Uncompleted Successfully",
            data: courseProgress
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Mark As Uncompleted",
            error: error.message,
        })
    }
}


module.exports={GetCourseProgress,
    UpdateLectureProgress,
    markAsCompleted,
    MarkAsUncompleted
}