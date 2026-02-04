import Assignment from "../models/Assignment.js";
import { uploadOnImageKit } from "../utils/Imagekit.js";

/**
 * ===============================
 * CREATE ASSIGNMENT (Teacher)
 * ===============================
 */
export const createAssignment = async (req, res) => {
    try {
        const {
            title,
            description,
            subject,
            course,
            semester,
            deadline,
        } = req.body;

        // Validate: description OR file must exist
        if (!description && !req.file) {
            return res.status(400).json({
                message: "Provide either assignment description or upload a file",
            });
        }

        let fileId = null;
        let fileUrl = null;

        // Upload file ONLY if teacher provided it
        if (req.file) {
            const uploadedFile = await uploadOnImageKit(req.file);

            if (!uploadedFile) {
                return res.status(500).json({ message: "File upload failed" });
            }

            fileId = uploadedFile.fileId;
            fileUrl = uploadedFile.url;
        }

        const assignment = await Assignment.create({
            title,
            description,
            subject,
            course,
            semester,
            deadline,
            teacherId: req.user.id,
            fileId,
            fileUrl,
        });

        res.status(201).json({
            success: true,
            message: "Assignment created successfully",
            assignment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


/**
 * ===============================
 * GET ASSIGNMENTS FOR STUDENT
 * (Based on course & semester)
 * ===============================
 */
export const getAssignmentsForStudent = async (req, res) => {
    try {
        const { course } = req.user;

        const assignments = await Assignment.find({
            course,
        }).sort({ createdAt: -1 });

        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * ===============================
 * GET ASSIGNMENTS BY TEACHER
 * ===============================
 */
export const getAssignmentsByTeacher = async (req, res) => {
    try {
        const assignments = await Assignment.find({
            teacherId: req.user.id,
        }).sort({ createdAt: -1 });

        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * ===============================
 * GET SINGLE ASSIGNMENT DETAILS
 * (Student & Teacher)
 * ===============================
 */
export const getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate("teacherId", "name email");

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        const isDeadlinePassed = new Date() > new Date(assignment.deadline);

        res.status(200).json({
            assignment,
            isDeadlinePassed,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * ===============================
 * DELETE ASSIGNMENT (Teacher)
 * ===============================
 */
export const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findOne({
            _id: req.params.id,
            teacherId: req.user.id,
        });

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        await assignment.deleteOne();

        res.status(200).json({ message: "Assignment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
