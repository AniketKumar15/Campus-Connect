import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
    {
        assignmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
            required: true
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        fileId: {
            type: String,
            required: true
        },
        fileUrl: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["submitted", "reviewed"],
            default: "submitted"
        },
        feedback: {
            type: String,
        },
        submittedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
)

submissionSchema.index(
    { assignmentId: 1, studentId: 1 },
    { unique: true }
);


export default mongoose.model("Submission", submissionSchema);