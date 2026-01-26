// models/Student.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        rollNo: {
            type: String,
            required: true,
            unique: true
        },
        course: {
            type: String,
            required: true
        },
        section: {
            type: String
        }
    },
    { timestamps: true }
);
export default mongoose.model("Student", studentSchema);
