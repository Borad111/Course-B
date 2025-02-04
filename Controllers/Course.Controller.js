const CourseModel = require("../Models/CourseModel");
const LectureModel = require("../Models/LectureModel");
const UserModel = require("../Models/UserModel");
const mongoose=require("mongoose");
const {
  DeleteMediaFromCloudinary,
  UploadMedia,
} = require("../Utils/Cloudinnary");
const CreateCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "CourseTitle And category are required",
      });
    }
    const CreateCourse = await CourseModel.create({
      courseTitle,
      category,
      creator: req.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Course Created Successfully",
      course: CreateCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error In Create Course Controller",
      error: error.message,
    });
  }
};

const FetchCreatorCourse = async (req, res) => {
  try {
    const courses = await CourseModel.find({ creator: req.userId });
    if (!courses) {
      return res.status(404).json({
        message: "Course Not Found",
        success: false,
        courses: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Course Fetched Successfully",
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Fetch Course Controller",
      error: error.message,
    });
  }
};

const FetchEditCourse = async (req, res) => {
  try {
    const course = await CourseModel.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Course Fetched Successfully",
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Fetch Course Controller",
      error: error.message,
    });
  }
};

const UpdateCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;

    // Check if the file is provided, otherwise use the old thumbnail
    let courseThumbnail;
    if (req.file) {
      courseThumbnail = req.file.path; // New file provided
    }

    let course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }

    // Delete old thumbnail if new file is provided
    if (courseThumbnail)
    {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await DeleteMediaFromCloudinary(publicId); // Delete the old file from Cloudinary
      }

      // Upload the new course thumbnail to Cloudinary
      const UploadCourseThumbnail = await UploadMedia(courseThumbnail);
      courseThumbnail = UploadCourseThumbnail?.secure_url;
    } else {
      // If no file is uploaded, use the existing thumbnail
      courseThumbnail = course.courseThumbnail;
    }

    // Prepare the update data object
    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail, // Use the updated (or existing) thumbnail
    };

    // Update the course in the database
    course = await CourseModel.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Course Updated Successfully",
      course: course,
    });
  } catch (error) {
    console.error("Error in UpdateCourse:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const PublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query;

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }
    course.isPublished = publish === "true";
    await course.save();

    return res.status(200).json({
      success: true,
      message: `Course ${publish ? "Published" : "Unpublished"} Successfully`,
      course: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Publish Course Controller",
      error: error.message,
    });
  }
};

const DeleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate courseId

    // Find the course and populate the lectures
    const course = await CourseModel.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }

    // Delete the course thumbnail from Cloudinary (if it exists)
    if (course.courseThumbnail) {
      const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
      await DeleteMediaFromCloudinary(publicId);
    }

    // Delete all lecture videos from Cloudinary (if videoURL exists)
    if (course.lectures.length > 0) {
      const lecturePromises = course.lectures.map(async (lecture) => {
        if (lecture.videoURL) {
          const publicId = lecture.videoURL.split("/").pop().split(".")[0];
          await DeleteMediaFromCloudinary(publicId);
        }
      });

      await Promise.all(lecturePromises);

      // Delete lecture records from the database
      await LectureModel.deleteMany({ _id: { $in: course.lectures } });
    }

    // Delete the course record
    await CourseModel.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Delete Course Controller",
      error: error.message,
    });
  }
};


const FetchCourses=async(_,res)=>{
  try {
    const courses=await CourseModel.find({isPublished:true}).populate({path:"creator" , select:"name photoURL"})
    if(!courses){
      return res.status(404).json({
        success:false,
        message: "Course Not Found",
      })
    }
    return res.status(200).json({
      success:true,
      message:"Course  Get Successfully",
      courses,
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Error in Fetch Coures Controller",
      error:error.message
    });
  }
}

const SearchCourse=async(req,res)=>{
  try {
      const {query="",categories=[],sortByPrice=""}=req.query;
      const SerachCriteria={
        isPublished:true,
        $or:[
          {courseTitle:{$regex:query, $options:"i"}},
          {subTitle:{$regex:query, $options:"i"}},
          {category:{$regex:query, $options:"i"}},
        ]
      }

      if(categories.length > 0) {
        SerachCriteria.category={$in:categories};
      }

      const sortOption={};
      if(sortByPrice === "low") {
        sortOption.coursePrice=1;
      } else if(sortByPrice === "high") {
        sortOption.coursePrice=-1;
      }
      
      const courses=await CourseModel.find(SerachCriteria).populate({path:"creator" , select:"name photoURL"}).sort(sortOption);
      if(!courses){
        return res.status(404).json({
          success:false,
          message: "Course Not Found",
        })
      }
      return res.status(200).json({
        success:true,
        message:"Course  Get Successfully",
        courses,
      })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Search Course Controller",
      error: error.message,
    })
    
  }
}

module.exports = {
  CreateCourse,
  FetchCreatorCourse,
  UpdateCourse,
  FetchEditCourse,
  PublishCourse,
  FetchCourses,
  SearchCourse,DeleteCourse
};
