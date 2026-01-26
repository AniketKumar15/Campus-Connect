import Resource from "../models/Resource.js";
import Notification from "../models/Notification.js";
import { uploadOnImageKit, deleteOnImageKit, replaceOnImageKit } from "../utils/Imagekit.js";


// POST - Upload Resource Api -> protect(middleware)
export const uploadResource = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file provided"
            });
        }

        const { title, description, course, semester, category } = req.body;

        if (!title || !course || !semester || !category) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        const semesterLimit = {
            BCA: 6,
            BBA: 6,
            MCA: 4,
            MBA: 4
        };

        const sem = Number(semester);

        if (!semesterLimit[course] || sem < 1 || sem > semesterLimit[course]) {
            return res.status(400).json({
                success: false,
                message: `Invalid semester for ${course}`
            });
        }

        const fileUpload = await uploadOnImageKit(req.file);
        if (!fileUpload) {
            return res.status(500).json({
                success: false,
                message: "Upload failed"
            });
        }

        let resource;
        try {
            resource = await Resource.create({
                uploadedBy: req.user.id,
                title: title.trim(),
                description,
                course,
                semester: sem,
                category,
                fileId: fileUpload.fileId,
                fileUrl: fileUpload.url,
                status: "pending"
            });
        } catch (dbError) {
            await deleteOnImageKit(fileUpload.fileId);
            throw dbError;
        }

        res.status(201).json({
            success: true,
            message: "Resource uploaded successfully",
            resource
        });

    } catch (error) {
        console.error("Upload Resource Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// GET Get Uploaded Resource Api
export const getAllResource = async (req, res) => {
    try {
        const resources = await Resource.find({ status: "approved" })
            .populate({
                path: "uploadedBy",
                select: "name role profileImage" // add/remove fields as needed
            });

        if (resources.length <= 0) {
            return res.status(404).json({
                success: false,
                message: "Empty Resource"
            });
        }

        res.status(200).json({
            success: true,
            message: "All resources fetched successfully",
            resources
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getAllResourceAdmin = async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 })
            .populate({
                path: "uploadedBy",
                select: "name role profileImage" // add/remove fields as needed
            });

        if (resources.length <= 0) {
            return res.status(404).json({
                success: false,
                message: "Empty Resource"
            });
        }
        res.status(200).json({
            success: true,
            message: "All resources fetched successfully",
            resources
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// Get -> User Specific Resource API -> protect(middleware)
export const getUserResource = async (req, res) => {
    try {
        const resources = await Resource.find({ uploadedBy: req.user.id })

        res.status(200).json({
            success: true,
            message: "All user resources fetched successfully",
            resources
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// PUT -> Edit the resource -> protect(middleware)
export const editResource = async (req, res) => {
    try {
        const semesterLimit = {
            BCA: 6,
            BBA: 6,
            MCA: 4,
            MBA: 4
        };

        const { title, description, course, semester, category } = req.body;
        const updatedResource = {};

        if (title) updatedResource.title = title;
        if (description) updatedResource.description = description;
        if (course) updatedResource.course = course;
        if (semester) updatedResource.semester = Number(semester);
        if (category) updatedResource.category = category;

        // Safe semester validation
        if (semester && course) {
            const sem = Number(semester);
            if (!semesterLimit[course] || sem < 1 || sem > semesterLimit[course]) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid semester for ${course}`
                });
            }
        }

        // Find resource
        let resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found"
            });
        }

        // Authorization
        if (resource.uploadedBy.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to update this resource"
            });
        }

        // Replace file if new file provided
        if (req.file) {
            const replacedFile = await replaceOnImageKit(
                req.file,
                resource.fileId
            );

            if (!replacedFile) {
                return res.status(500).json({
                    success: false,
                    message: "File replacement failed"
                });
            }

            updatedResource.fileId = replacedFile.fileId;
            updatedResource.fileUrl = replacedFile.url;
        }

        // Reset approval status after edit
        updatedResource.status = "pending";

        // Update resource
        resource = await Resource.findByIdAndUpdate(
            req.params.id,
            { $set: updatedResource },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Resource updated successfully",
            resource
        });

    } catch (error) {
        console.error("Edit Resource Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Delete Uploaded Resource Api -> protect(middleware)
export const deleteResource = async (req, res) => {
    try {
        const { id } = req.params;

        // Find resource
        const resource = await Resource.findById(id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found"
            });
        }

        // Authorization check (uploader or admin)
        if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this resource"
            });
        }

        await deleteOnImageKit(resource.fileId)
        // Delete resource
        await resource.deleteOne();

        res.status(200).json({
            success: true,
            message: "Resource deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Update the status of the resource like approve or reject -> protect(middleware)
export const statusUpdateResource = async (req, res) => {
    try {
        // Admin check (assumes role exists on req.user)
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access only"
            });
        }

        const { status, rejectionReason } = req.body;

        if (status === "rejected" && !rejectionReason) {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required"
            });
        }

        // Validate status
        if (!status || !["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found"
            });
        }

        // Prevent redundant updates
        if (resource.status === status) {
            return res.status(400).json({
                success: false,
                message: `Resource already ${status}`
            });
        }

        resource.status = status;
        resource.rejectionReason = status === "rejected" ? rejectionReason : null;
        await resource.save();

        if (status === "approved") {
            await Notification.create({
                user: resource.uploadedBy,
                type: "resource_approved",
                message: `Your resource "${resource.title}" has been approved`
            });
        }

        if (status === "rejected") {
            await Notification.create({
                user: resource.uploadedBy,
                type: "resource_rejected",
                message: `Your resource "${resource.title}" has been rejected${resource.rejectionReason ? ` due to: ${resource.rejectionReason}` : ""
                    }`
            });
        }

        res.status(200).json({
            success: true,
            message: `Resource ${status} successfully`,
            resource
        });
    } catch (error) {
        console.error("Resource Status Update Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
