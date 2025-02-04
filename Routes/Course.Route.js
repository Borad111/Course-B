const express=require('express');
const { isAuthenticatedMiddleWare } = require('../MiddleWares/isAuthenticated');
const { CreateCourse, FetchCreatorCourse, UpdateCourse, FetchEditCourse, PublishCourse, FetchCourses, SearchCourse, DeleteCourse } = require('../Controllers/Course.Controller');
const upload = require('../Utils/multer');
const { CreateLecture, GetLecture, GetLectureDataFromCourse, EditLecture, DeleteLecture } = require('../Controllers/Lecture.Controller');
const { GetAllPurchaseCourse } = require('../Controllers/CoursePurchase.Controller');
const router=express.Router();

router.get('/search',isAuthenticatedMiddleWare,SearchCourse);
router.post('/',isAuthenticatedMiddleWare,CreateCourse)
router.get('/',isAuthenticatedMiddleWare,FetchCreatorCourse )
router.get('/fetchEditCourse/:courseId',isAuthenticatedMiddleWare,FetchEditCourse)
router.put('/:courseId',isAuthenticatedMiddleWare,upload.single("courseThumbnail"),UpdateCourse)
router.post('/:courseId/createLecture',isAuthenticatedMiddleWare,CreateLecture)
router.get('/:courseId/GetLecture',isAuthenticatedMiddleWare,GetLecture)
router.get('/lecture/:lectureId',isAuthenticatedMiddleWare,GetLectureDataFromCourse)
router.put('/:courseId/course/:lectureId/lecture',isAuthenticatedMiddleWare,EditLecture)
router.delete('/lecture/:lectureId',DeleteLecture)
router.patch('/:courseId/',isAuthenticatedMiddleWare,PublishCourse)
router.get('/getPublishCourses',FetchCourses)
router.delete('/deletecourse/:courseId',DeleteCourse)
// router.get('/getAllPurchaseCourse',isAuthenticatedMiddleWare,GetAllPurchaseCourse)
module.exports=router;