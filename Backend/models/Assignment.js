import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String
        },
        subject: {
            type: String,
            required: true
        },
        course: {
            type: String,
            required: true,
            enum: ["BCA", "MCA", "BBA", "MBA"],
        },
        semester: {
            type: Number,
            required: true,
            min: 1,
            max: 6
        },
        fileId: {
            type: String,
        },
        fileUrl: {
            type: String,
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty",
            required: true
        },
        deadline: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
)

export default mongoose.model("Assignment", assignmentSchema);