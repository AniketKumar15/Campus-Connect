// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["student", "faculty", "admin"],
            required: true
        },
        profileImage: {
            type: String, // URL (Cloudinary / S3 / local)
            default: ""
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
