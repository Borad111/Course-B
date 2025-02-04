const express=require('express');
const upload=require('../Utils/multer')
const {UploadMedia, DeleteVidioFromCloudinary}=require('../Utils/Cloudinnary')
const lectureModel=require('../Models/LectureModel');
const router=express.Router();


router.post('/upload-media',upload.single('file'),async(req,res)=>{
    try {
        const {lectureId}=req.body;
        const lecture=await lectureModel.findById(lectureId);   
        if(!lecture){
            return res.status(404).json({
                success: false,
                message: "Lecture Not Found",
            });  // Return 404 if lecture not found. 400 for bad request. 200 for success. 500 for server error. 201 for created.
        }
        if(lecture?.publicId){
            await DeleteVidioFromCloudinary(lecture.publicId);
        }
        const result=await UploadMedia(req.file.path);
        return res.status(200).json({
            success: true,
            message: "Video  Uploaded Successfully",
            data: result,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Upload Media API",
            error: error.message,
        })
    }
}) 

module.exports=router;