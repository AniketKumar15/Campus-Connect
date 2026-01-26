// models/Faculty.js
import mongoose from "mongoose";

const facultySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        department: {
            type: String,
            required: true
        },
        designation: {
            type: String // Assistant Prof, HOD, etc.
        }
    },
    { timestamps: true }
);

export default mongoose.model("Faculty", facultySchema);
