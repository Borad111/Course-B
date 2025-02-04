const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseTitle: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  courseLevel: {
    type: String,
  },
  coursePrice: {
    type: Number,
  },
  courseThumbnail: {
    type: String,
  },
  enrolledStudent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  lectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isPublished:{
    type:Boolean,
    default:false,
  },

},{timestamps:true});


module.exports = mongoose.model("Course", CourseSchema);
