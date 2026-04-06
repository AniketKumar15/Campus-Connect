import User from "../models/User.js";
import Student from "../models/Student.js";
import Faculty from "../models/Faculty.js";
import Admin from "../models/Admin.js";
import { uploadOnImageKit } from "../utils/Imagekit.js";

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        
        // Destructure possible update fields
        const { 
            name, 
            rollNo, 
            course, 
            section, 
            department, 
            designation 
        } = req.body;

        let profileImage = undefined;
        if (req.file) {
            const uploadedFile = await uploadOnImageKit(req.file);
            if (!uploadedFile) {
                return res.status(500).json({ message: "Image upload failed" });
            }
            profileImage = uploadedFile.url;
        }

        // 1. Update Base User Fields
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                ...(name && { name }), 
                ...(profileImage && { profileImage }) 
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        let roleData = null;

        // 2. Update Role Specific Models
        if (role === "student") {
            roleData = await Student.findOneAndUpdate(
                { user: userId },
                {
                    ...(rollNo && { rollNo }),
                    ...(course && { course }),
                    ...(section && { section })
                },
                { new: true, runValidators: true }
            );
        } else if (role === "faculty") {
            roleData = await Faculty.findOneAndUpdate(
                { user: userId },
                {
                    ...(department && { department }),
                    ...(designation && { designation })
                },
                { new: true, runValidators: true }
            );
        } else if (role === "admin") {
            roleData = await Admin.findOne({ user: userId });
        }

        // Merge Base User Object + Role details for response payload
        const mergedUser = {
            ...updatedUser.toObject(),
            ...((roleData && roleData.toObject) ? roleData.toObject() : roleData)
        };

        // Remove duplicate reference id field
        if (mergedUser.user) {
            delete mergedUser.user;
        }

        res.status(200).json({
            success: true,
            user: mergedUser,
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.error("Profile update error:", error);
        // Handle MongoDB E11000 duplicate key error for RollNo
        if (error.code === 11000) {
           return res.status(400).json({ message: "Roll Number already registered. Please check.", error: error.message });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
