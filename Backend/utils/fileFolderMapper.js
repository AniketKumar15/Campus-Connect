// utils/fileFolderMapper.js
export const getFolderByMimeType = (mimeType) => {
    if (!mimeType) return "/campusconnect/others";

    if (mimeType.startsWith("image/")) {
        return "/campusconnect/images";
    }

    if (
        mimeType === "application/pdf" ||
        mimeType.includes("word") ||
        mimeType.includes("excel") ||
        mimeType.includes("powerpoint") ||
        mimeType === "text/plain" ||
        mimeType.includes("zip")
    ) {
        return "/campusconnect/documents";
    }

    if (mimeType.startsWith("video/")) {
        return "/campusconnect/videos";
    }

    if (mimeType.startsWith("audio/")) {
        return "/campusconnect/audio";
    }

    return "/campusconnect/others";
};
