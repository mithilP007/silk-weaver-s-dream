const fs = require("fs");
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
      // Clean up the uploaded local file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({
        success: false,
        message: "Server is not configured for image uploads (missing Supabase configuration)",
      });
    }

    let folder = `${type}s`;
    if (type === "category") {
      folder = "categories";
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const uploadUrl = `${supabaseUrl}/storage/v1/object/${supabaseBucket}/${folder}/${req.file.filename}`;

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabaseServiceKey}`,
        "apikey": supabaseServiceKey,
        "Content-Type": req.file.mimetype,
      },
      body: fileBuffer,
    });

    let uploadData;
    const contentType = uploadResponse.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      uploadData = await uploadResponse.json();
    } else {
      const text = await uploadResponse.text();
      uploadData = { message: text };
    }

    // Clean up local temp file immediately after upload
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (!uploadResponse.ok) {
      return res.status(uploadResponse.status).json({
        success: false,
        message: uploadData.message || "Failed to upload image to Supabase",
        error: uploadData,
      });
    }

    const imageUrl = `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/${folder}/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl,
      fileName: req.file.filename,
    });
  } catch (error) {
    // Make sure we clean up the file if an error occurred during reading or sending
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Failed to clean up temp file:", err);
      }
    }

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

