import mongoose from "mongoose";
import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import {
    uploadOnImageKit,
    deleteOnImageKit,
} from "../utils/Imagekit.js";

/**
 * ===============================
 * SUBMIT ASSIGNMENT (Student)
 * ===============================
 */
export const submitAssignment = async (req, res) => {
    let uploadedFile = null;

    try {
        const { assignmentId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
            return res.status(400).json({ message: "Invalid assignment ID" });
        }

        if (!req.file) {
            return res
                .status(400)
                .json({ message: "Submission file is required" });
        }

        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Deadline check
        if (new Date() > new Date(assignment.deadline)) {
            return res
                .status(400)
                .json({ message: "Submission deadline has passed" });
        }

        // Prevent duplicate submission
        const existingSubmission = await Submission.findOne({
            assignmentId,
            studentId: req.user.id,
        });
        if (existingSubmission) {
            return res.status(400).json({
                message: "You have already submitted this assignment",
            });
        }

        // Upload file
        uploadedFile = await uploadOnImageKit(req.file);

        if (!uploadedFile) {
            return res.status(500).json({ message: "File upload failed" });
        }

        const submission = await Submission.create({
            assignmentId,
            studentId: req.user.id,
            fileId: uploadedFile.fileId,
            fileUrl: uploadedFile.url,
        });

        res.status(201).json({
            success: true,
            message: "Assignment submitted successfully",
            submission,
        });
    } catch (error) {
        console.error(error);

        // cleanup uploaded file if DB fails
        if (uploadedFile?.fileId) {
            await deleteOnImageKit(uploadedFile.fileId);
        }

        res.status(500).json({ message: "Server error" });
    }
};

/**
 * ===============================
 * GET SUBMISSIONS BY ASSIGNMENT
 * ===============================
 */
export const getSubmissionsByAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
            return res.status(400).json({ message: "Invalid assignment ID" });
        }

        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // faculty can only view own assignments
        if (
            req.user.role === "faculty" &&
            assignment.teacherId.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        const submissions = await Submission.find({ assignmentId })
            .populate("studentId", "name email")
            .sort({ submittedAt: -1 });

        res.status(200).json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * ===============================
 * GET STUDENT'S SUBMISSION
 * ===============================
 */
export const getMySubmission = async (req, res) => {
    try {
        const submissions = await Submission.find({
            studentId: req.user.id,
        }).populate("assignmentId"); // important

        if (!submissions) {
            return res
                .status(404)
                .json({ message: "Submission not found" });
        }

        res.status(200).json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * ===============================
 * REVIEW SUBMISSION (Faculty)
 * ===============================
 */
export const reviewSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { feedback } = req.body;

        if (!mongoose.Types.ObjectId.isValid(submissionId)) {
            return res.status(400).json({ message: "Invalid submission ID" });
        }

        const submission = await Submission.findById(submissionId)
            .populate("assignmentId");

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        // ownership check
        if (
            submission.assignmentId.teacherId.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        submission.feedback = feedback;
        submission.status = "reviewed";
        submission.reviewedAt = new Date();

        await submission.save();

        res.status(200).json({
            success: true,
            message: "Submission reviewed",
            submission,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * ===============================
 * ADMIN: GET ALL SUBMISSIONS
 * ===============================
 */
export const getAllSubmissions = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = 50;
        const skip = (page - 1) * limit;

        const submissions = await Submission.find()
            .populate("studentId", "name email")
            .populate("assignmentId", "title subject")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: "All submissions retrieved",
            submissions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
