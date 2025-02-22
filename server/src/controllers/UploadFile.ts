import { Request, Response } from "express";
import cloudinary from "../config/cloud.config.js";

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    }
    const profileImage = req.file;
    console.log("profileimageee", profileImage);
    // Upload file buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "chat_groups",
          resource_type: "auto",
          allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "webp",
            "mp4",
            "mov",
            "avi",
            "webm",
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(profileImage.buffer); // Send file buffer
    });
    res.status(200).json({
      success: true,
      fileUrl: (uploadResult as any).secure_url, // Cloudinary URL
      fileType: req.file.mimetype.startsWith("image") ? "image" : "video",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed.", error });
  }
};
