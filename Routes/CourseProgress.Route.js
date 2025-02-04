const express=require('express');
const { isAuthenticatedMiddleWare } = require('../MiddleWares/isAuthenticated');
const { GetCourseProgress, UpdateLectureProgress, MarkAsUncompleted, markAsCompleted } = require('../Controllers/Course.Progress.Controller');
const router=express.Router();


router.get('/:courseId',isAuthenticatedMiddleWare,GetCourseProgress)
router.post('/:courseId/lecture/:lectureId/view',isAuthenticatedMiddleWare,UpdateLectureProgress)
router.post('/:courseId/complete',isAuthenticatedMiddleWare,markAsCompleted)
router.post('/:courseId/Incomplete',isAuthenticatedMiddleWare,MarkAsUncompleted)





module.exports=router;