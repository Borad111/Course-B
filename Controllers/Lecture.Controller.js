const LectureModel = require("../Models/LectureModel");
const CourseModel = require("../Models/CourseModel");
const { UploadMedia, DeleteVidioFromCloudinary } = require("../Utils/Cloudinnary");
const CreateLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle) {
      return res.status(404).json({
        success: false,
        message: "Lecture Title  is Required ",
      });
    }
    if (!courseId) {
      return res.status(404).json({
        success: false,
        message: "Course Id is Required",
      });
    }
    const CreateLecture = await LectureModel.create({
      lectureTitle,
    });
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }
    course.lectures.push(CreateLecture._id);
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Lecture Created Successfully",
      lecture: CreateLecture,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in creating lecture Controller",
      error: error.message,
    });
  }
};

const GetLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await CourseModel.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Course and Lectures Fetched Successfully",
      lectures: course.lectures,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Get Lecture Controller",
      error: error.message,
    });
  }
};

const UpdateLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Update Lecture Controller",
      error: error.message,
    });
  }
};

const EditLecture = async (req, res) => {
  try {
    const { lectureTitle, uploadVideoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;
    const lecture = await LectureModel.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture Not Found",
      });
    }

   if(lectureTitle) lecture.lectureTitle = lectureTitle;
   if(uploadVideoInfo){
    lecture.vidioUrl=uploadVideoInfo.videoUrl;
    lecture.publicId=uploadVideoInfo.publicId;
   } 
   if(isPreviewFree) lecture.isPreviewFree = isPreviewFree;

   await lecture.save();
   
    res.status(200).json({
      success: true,
      message: "Lecture Update Successfully",
      UpdateLecture,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Edit Lecture Controller",
      error: error.message,
    });
  }
};

const DeleteLecture=async(req,res)=>{
    try {
        const {lectureId}=req.params;
        if(!lectureId){
          return res.status(404).json({
                success: false,
                message: "LectureId are Required",
            });
        }
        const lecture=await LectureModel.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                success: false,
                message: "Lecture Not Found",
            });
        }
        const publicId=lecture.publicId || "";
        const DeleteLecture=await LectureModel.findByIdAndDelete(lectureId);
        const DeleteLectureFromCourse=await  CourseModel.updateOne({lectures:lectureId},{$pull:{lectures:lectureId}})
        if(publicId){
            await DeleteVidioFromCloudinary(publicId);
        }

        return res.status(200).json({
            success: true,
            message: "Lecture Delete Successfully",
            DeleteLecture,
            DeleteLectureFromCourse,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Delete Lecture Controller",
            error: error.message,
        });
    }
}

const GetLectureDataFromCourse=async(req,res)=>{
    try {
        const {lectureId}=req.params;
        if(!lectureId ){
            return res.status(404).json({
                success: false,
                message: " LectureId are Required",
            });
        }
        const lecture=await LectureModel.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                success: false,
                message: "Lecture Not Found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Lecture Data Fetched Successfully",
            lecture,
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Error in Get Lecture Data From Course Controller",
            error: error.message,
        })
    }
}

module.exports = { CreateLecture, GetLecture, UpdateLecture, EditLecture ,DeleteLecture,
    GetLectureDataFromCourse
 };
