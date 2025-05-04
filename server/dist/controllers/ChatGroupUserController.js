import prisma from "../config/db.config.js";
import cloudinary from "../config/cloud.config.js";
class ChatGroupUserController {
    static async index(req, res) {
        try {
            const { group_id } = req.query;
            const users = await prisma.groupUsers.findMany({
                where: {
                    group_id: group_id,
                },
            });
            return res.json({ message: "data fetch successfully", data: users });
        }
        catch (error) {
            return res.status(500).json({ message: "something error" });
        }
    }
    static async store(req, res) {
        try {
            const body = req.body;
            // Access file with the correct type (Express.Multer.File)
            const profileImage = req.file;
            console.log("imageee", profileImage);
            if (!profileImage) {
                return res.status(400).json({ message: "Profile image is required" });
            }
            // Upload file buffer to Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    folder: "chat_groups",
                    allowed_formats: ["jpg", "jpeg", "png", "webp"],
                }, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(result);
                    }
                });
                uploadStream.end(profileImage.buffer); // Send file buffer
            });
            console.log("uploadresulttt", uploadResult);
            const data = await prisma.groupUsers.create({
                data: {
                    group_id: body.id,
                    name: body.name,
                    profile_image: uploadResult.secure_url,
                },
            });
            return res.json({ message: "Group user added Successfully", data: data });
        }
        catch (error) {
            console.error("Error adding group user:", error); // Logs the exact error
            res.status(500).json({
                message: "An error occurred",
                error: error.message, // Optionally include the error message in the response
            });
        }
    }
}
export default ChatGroupUserController;
