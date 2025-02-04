const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const UploadMedia = async (file) => {
  try {
    const uploadResponce = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return uploadResponce;
  } catch (error) {
    console.log("Error in uploading file", error);
    throw new Error("Error in uploading file");
  }
};

const DeleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log("Error in deleting file", error);
  }
};

const DeleteVidioFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId,{resource_type:"video"});
    } catch (error) {
         console.log("Error in deleting video", error);
         throw new Error("Error in deleting video");
    }
}

module.exports = {UploadMedia,DeleteMediaFromCloudinary,DeleteVidioFromCloudinary};
