// utils/Imagekit.js
import ImageKit, { toFile } from "@imagekit/nodejs";
import { getFolderByMimeType } from "./fileFolderMapper.js";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const uploadOnImageKit = async (file) => {
    try {
        if (!file) return null;

        const folder = getFolderByMimeType(file.mimetype);

        const uploadedFile = await imagekit.files.upload({
            file: await toFile(file.buffer, file.originalname),
            fileName: file.originalname,
            folder,
            useUniqueFileName: true,
        });

        return uploadedFile;
    } catch (error) {
        console.error("ImageKit upload error:", error);
        return null;
    }
};

export const deleteOnImageKit = async (fileId) => {
    try {
        if (!fileId) {
             return false;
        }

        // If a URL was passed instead of fileId, we cannot easily delete it
        // since imagekit.files.delete strictly requires a file ID. 
        // We'll gracefully ignore it to prevent 500 errors across the system.
        if (fileId.startsWith("http")) {
            console.log("Ignored ImageKit delete since URL was provided instead of fileId.");
            return true;
        }

        await imagekit.files.delete(fileId);
        return true;
    } catch (error) {
        console.error("ImageKit delete error:", error);
        // Do not throw error to avoid 500 internal server errors blocking the DB deletion
        return false;
    }
};

export const replaceOnImageKit = async (newFile, oldFileId) => {
    try {
        const newUpload = await uploadOnImageKit(newFile);
        if (!newUpload) return null;

        if (oldFileId) {
            await deleteOnImageKit(oldFileId);
        }

        return newUpload;
    } catch (error) {
        console.error("ImageKit replace error:", error);
        return null;
    }
};
