import prisma from "../config/db.config.js";
import cloudinary from "../config/cloud.config.js";
class ChatGroupController {
    static async store(req, res) {
        try {
            const body = req.body;
            const user = req.user;
            // Access file with the correct type (Express.Multer.File)
            const profileImage = req.file;
            console.log("imageee", profileImage);
            // if (!profileImage) {
            //   return res.status(400).json({ message: "Profile image is required" });
            // }
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
            const data = await prisma.chatGroup.create({
                data: {
                    user_id: user.id,
                    title: body.title,
                    passcode: body.passcode,
                    profile_image: uploadResult.secure_url,
                },
            });
            return res.json({
                message: "Chat Group created Successfully",
                data: data,
            });
        }
        catch (error) {
            res.status(500).json({
                message: "something error",
            });
        }
    }
    static async index(req, res) {
        try {
            const user = req.user;
            const data = await prisma.chatGroup.findMany({
                where: {
                    user_id: user.id,
                },
                orderBy: {
                    created_at: "desc",
                },
            });
            return res.json({
                message: "Chat Groups fetched Successfully",
                data: data,
            });
        }
        catch (error) {
            res.status(500).json({
                message: "something error",
            });
        }
    }
    static async show(req, res) {
        try {
            const { id } = req.params;
            console.log("Received ID:", id);
            // Ensure `id` is parsed to the correct type if needed
            const data = await prisma.chatGroup.findUnique({
                where: {
                    id: id, // Use `Number(id)` if `id` is an integer, or directly `id` if it's a string/UUID
                },
            });
            if (!data) {
                return res.status(404).json({ message: "Chat Group not found" });
            }
            return res.json({ message: "Chat Group fetched successfully", data });
        }
        catch (error) {
            console.error("Error fetching Chat Group:", error);
            res.status(500).json({
                message: "Something went wrong",
            });
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const body = req.body;
            const data = await prisma.chatGroup.update({
                data: {
                    title: body.title,
                    passcode: body.passcode,
                },
                where: {
                    id: id,
                },
            });
            return res.json({ message: "Chat updated Successfully", data: data });
        }
        catch (error) {
            res.status(500).json({
                message: "something error",
            });
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const data = await prisma.chatGroup.delete({
                where: {
                    id: id,
                },
            });
            return res.json({ message: "Chat deleted Successfully", data: data });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: "something error",
            });
        }
    }
}
export default ChatGroupController;
