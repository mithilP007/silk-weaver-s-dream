const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = path.join(__dirname, "../uploads/products");

    if (req.params.type === "category") {
      folder = path.join(__dirname, "../uploads/categories");
    }

    if (req.params.type === "banner") {
      folder = path.join(__dirname, "../uploads/banners");
    }

    createFolderIfNotExists(folder);
    cb(null, folder);
  },

  filename: function (req, file, cb) {
    const baseName = file.originalname.split(".")[0].replace(/\s+/g, "-").toLowerCase();
    let extension = path.extname(file.originalname).toLowerCase();
    if (!extension) {
      if (file.mimetype === "image/png") extension = ".png";
      else if (file.mimetype === "image/webp") extension = ".webp";
      else extension = ".jpg";
    }
    const uniqueName = Date.now() + "-" + baseName + extension;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase()) || file.originalname === "blob" || file.originalname.includes("category-image");
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
