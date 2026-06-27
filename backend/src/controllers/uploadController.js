const uploadImage = (req, res) => {
  try {
    const { type } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    let folder = `${type}s`;
    if (type === "category") {
      folder = "categories";
    }
    const imageUrl = `/uploads/${folder}/${req.file.filename}`;

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
