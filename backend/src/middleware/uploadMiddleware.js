const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "sri-kamatchi/products";

    if (req.params.type === "category") {
      folder = "sri-kamatchi/categories";
    }

    if (req.params.type === "banner") {
      folder = "sri-kamatchi/banners";
    }

    const baseName = file.originalname.split(".")[0].replace(/\s+/g, "-").toLowerCase();
    const uniqueName = Date.now() + "-" + baseName;

    return {
      folder: folder,
      public_id: uniqueName,
      allowed_formats: ["jpeg", "jpg", "png", "webp"],
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase()) || file.originalname === "blob";
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only jpg, jpeg, png, and webp images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
