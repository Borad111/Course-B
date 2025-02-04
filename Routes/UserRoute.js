const express=require('express');
const { RegistrationController, LoginController, GetUserProfileController, LogoutController, UpdateProfileController } = require('../Controllers/User.Controller');
const { isAuthenticatedMiddleWare } = require('../MiddleWares/isAuthenticated');
const upload = require('../Utils/multer');
 const router = express.Router();

router.post('/registration',RegistrationController)

router.post('/login',LoginController)

router.get('/profile',isAuthenticatedMiddleWare,GetUserProfileController)

router.put('/profile/update',isAuthenticatedMiddleWare,upload.single("profilePhoto"),UpdateProfileController)

router.post('/logout', LogoutController)

 module.exports=router