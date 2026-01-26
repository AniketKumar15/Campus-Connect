// models/PreApprovedUser.js
import mongoose from "mongoose";

const preApprovedUserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        role: {
            type: String,
            enum: ["student", "faculty", "admin"],
            required: true
        },
        isRegistered: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export default mongoose.model(
    "PreApprovedUser",
    preApprovedUserSchema
);
