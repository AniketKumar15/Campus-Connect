import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
    {
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String
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
        category: {
            type: String,
            enum: ["notes", "pyq", "reference"],
            required: true,
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
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        rejectionReason: {
            type: String
        }
    },
    { timestamps: true }
);

resourceSchema.index({ course: 1, semester: 1, category: 1, state: 1 });

export default mongoose.model("Resource", resourceSchema);
