const path = require("path");

const uploadImage = async (req, res) => {
  try {
    const { type } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseBucket = process.env.SUPABASE_BUCKET || "sri-kamatchi-images";

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({
        success: false,
        message: "Server is not configured for image uploads (missing Supabase configuration)",
      });
    }

    let folder = `${type}s`;
    if (type === "category") {
      folder = "categories";
    }

    // Generate unique filename using original filename & timestamp
    const baseName = req.file.originalname.split(".")[0].replace(/\s+/g, "-").toLowerCase();
    let extension = path.extname(req.file.originalname).toLowerCase();
    if (!extension) {
      if (req.file.mimetype === "image/png") extension = ".png";
      else if (req.file.mimetype === "image/webp") extension = ".webp";
      else extension = ".jpg";
    }
    const uniqueFilename = `${Date.now()}-${baseName}${extension}`;

    const uploadUrl = `${supabaseUrl}/storage/v1/object/${supabaseBucket}/${folder}/${uniqueFilename}`;

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabaseServiceKey}`,
        "apikey": supabaseServiceKey,
        "Content-Type": req.file.mimetype,
      },
      body: req.file.buffer, // Raw file buffer in memory
    });

    let uploadData;
    const contentType = uploadResponse.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      uploadData = await uploadResponse.json();
    } else {
      const text = await uploadResponse.text();
      uploadData = { message: text };
    }

    if (!uploadResponse.ok) {
      return res.status(uploadResponse.status).json({
        success: false,
        message: uploadData.message || "Failed to upload image to Supabase",
        error: uploadData,
      });
    }

    const imageUrl = `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/${folder}/${uniqueFilename}`;

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl,
      fileName: uniqueFilename,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Image upload failed due to internal error",
      error: error.message,
    });
  }
};

module.exports = {
  uploadImage,
};

