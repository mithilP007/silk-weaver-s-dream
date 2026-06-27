const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    // req.file.path contains the secure Cloudinary URL
    const imageUrl = req.file.path;

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl,
      fileName: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

module.exports = {
  uploadImage,
};
