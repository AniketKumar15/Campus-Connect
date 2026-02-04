import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import { uploadOnImageKit } from "../utils/Imagekit.js";

/**
 * ===============================
 * SUBMIT ASSIGNMENT (Student)
 * ===============================
 */
export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Submission file is required" });
        }

        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // ❌ Deadline check
        if (new Date() > new Date(assignment.deadline)) {
            return res.status(400).json({ message: "Submission deadline has passed" });
        }

        const uploadedFile = await uploadOnImageKit(req.file);

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
        // Duplicate submission (unique index)
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You have already submitted this assignment",
            });
        }

        res.status(500).json({ message: "Server error" });
    }
};

/**
 * ===============================
 * GET ALL SUBMISSIONS (Teacher)
 * ===============================
 */
export const getSubmissionsByAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Teacher can only see their own assignment submissions
        if (
            req.user.role === "teacher" &&
            assignment.teacherId.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        const submissions = await Submission.find({ assignmentId })
            .populate("studentId", "name email")
            .sort({ submittedAt: -1 });

        res.status(200).json(submissions);
    } catch (error) {
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
        const { assignmentId } = req.params;

        const submission = await Submission.findOne({
            assignmentId,
            studentId: req.user.id,
        });

        res.status(200).json(submission); // can be null
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * ===============================
 * REVIEW SUBMISSION (Teacher)
 * ===============================
 */
export const reviewSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { feedback } = req.body;

        const submission = await Submission.findById(submissionId)
            .populate("assignmentId");

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        // Teacher ownership check
        if (
            submission.assignmentId.teacherId.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        submission.feedback = feedback;
        submission.status = "reviewed";
        await submission.save();

        res.status(200).json({
            success: true,
            message: "Submission reviewed",
            submission,
        });
    } catch (error) {
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
        const submissions = await Submission.find()
            .populate("studentId", "name email")
            .populate("assignmentId", "title subject")
            .sort({ createdAt: -1 });

        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
