const userModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { GenaratToken } = require("../Utils/GenaratToken");
const { response } = require("express");
const dotenv = require("dotenv");
const path = require("path");
const {
  DeleteMediaFromCloudinary,
  UploadMedia,
} = require("../Utils/Cloudinnary");
dotenv.config();
const RegistrationController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(404).json({
        success: false,
        message: "please Provide All filed",
      });
    }
    const UserExit = await userModel.findOne({ email });
    if (UserExit) {
      return res.status(404).json({
        success: false,
        message: "User already exist",
      });
    }
    var salt = bcrypt.genSaltSync(10);
    const HashPassword = await bcrypt.hash(password, salt);
    const CreateUser = await userModel.create({
      name,
      email,
      password: HashPassword,
    });
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: CreateUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "Please Provide All filed",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid Email Or Password",
      });
    }
    const PasswordMatch = await bcrypt.compare(password, user.password);
    if (!PasswordMatch) {
      return res.status(404).json({
        success: false,
        message: "Invalid Email Or Password",
      });
    }
    GenaratToken(res, user);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in login API",
      error: error.message,
    });
  }
};

const LogoutController = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logged Out Successfully",
      user: null,
      token: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error In Logout Api",
      error: error.message,
    });
  }
};

const GetUserProfileController = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.userId)
      .select("-password")
      .populate("enrollCourses");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User Successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in GetUserProfile API",
      error: error.message,
    });
  }
};

const UpdateProfileController = async (req, res) => {
  try {
    const { name } = req.body;
    const ProfilePhoto = req.file;
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found In Update Profile Controller",
      });
    }
    const UpdatedName = name || user.name;
    let cloudResponce = null;

    let photoURL;
    if (ProfilePhoto) {
      if (user.photoURL) {
        const publicId = user.photoURL.split("/").pop().split(".")[0];
        DeleteMediaFromCloudinary(publicId);
      }
      const cloudResponce = await UploadMedia(ProfilePhoto.path);
        photoURL = cloudResponce.secure_url;
    }
    else{
        photoURL = user.photoURL;
    }
    const updatedData = { name:UpdatedName, photoURL };

    const updateUser = await userModel.findByIdAndUpdate(
      req.userId,
      updatedData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "User Profile Updated Successfully",
      user: updateUser,
      photoURL: photoURL,
      oldPhotoURL: user.photoURL,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Update Profile Controller Api",
      error: error.message,
    });
  }
};

module.exports = {
  RegistrationController,
  LoginController,
  LogoutController,
  GetUserProfileController,
  UpdateProfileController,
};
