const multer = require("multer");
const cloudinary = require("../config/cloudinary")
const {CloudinaryStorage} = require("multer-storage-cloudinary");


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
    //   folder: "smartOcr",
    //   format: async (req, file) => "png",
    //   public_id: (req, file) => file.fieldname + "_" + Date.now(),
    //   transformation: [{ width: 800, height: 600, crop: "fill" }],
    folder: 'smartOcr',
    allowed_formats: ['jpg', 'png'],


},
  });


const upload = multer({
    storage,
    // limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
    // fileFilter: function (req, file, cb) {
    //   if (file.mimetype.startsWith("image/")) {
    //     cb(null, true);
    //   } else {
    //     cb(new Error("Not an Image! Please upload an Image."), false);
    //   }
    // },
  });


module.exports = upload;