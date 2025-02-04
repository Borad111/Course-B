const express=require('express');
const { isAuthenticatedMiddleWare } = require('../MiddleWares/isAuthenticated');
const { CreateCheackOutSession, stripeWebhook, GetCourseDetailsWithParchaseStatus, GetAllPurchaseCourse } = require('../Controllers/CoursePurchase.Controller');
const router=express.Router();


router.get('/',GetAllPurchaseCourse);
router.post('/checkout/create-checkout-session',isAuthenticatedMiddleWare,CreateCheackOutSession)
router.post('/webhook',express.raw({type:"application/json"}),stripeWebhook);   
router.get('/course/:courseId/detail-with-status',isAuthenticatedMiddleWare,GetCourseDetailsWithParchaseStatus)


module.exports=router;