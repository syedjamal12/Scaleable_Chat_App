import multer from "multer";
const storage = multer.memoryStorage(); // Store file in memory (or use diskStorage if saving locally)
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});
export default upload;
