import { uploadOnImageKit } from "../utils/Imagekit.js";

export const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
    }

    try {
        const result = await uploadOnImageKit(req.file);

        if (!result) {
            return res.status(500).json({ message: "Upload failed" });
        }
        console.log(result);
        res.status(200).json({
            success: true,
            url: result.url,
            fileId: result.fileId,
            name: result.name,
            mimeType: result.mime,
            folder: result.filePath,
            message: result.name + " Uploaded"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Upload failed" });
    }

};


