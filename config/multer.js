const multer = require("multer");
const cloudinary = require("../config/cloudinary")
const {CloudinaryStorage} = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "ocr",
        format: async (req, file) => "png", // Example: Save everything as PNG
        resource_type: "image", // Ensure Cloudinary treats it as an image
    }
    
})

const upload = multer({storage});

module.exports = upload;