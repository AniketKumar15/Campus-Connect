import express from "express";
import {
    createAssignment,
    getAssignmentsForStudent,
    getAssignmentsByTeacher,
    getAssignmentById,
    deleteAssignment,
} from "../controllers/assignmentController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

/**
 * ===============================
 * TEACHER ROUTES
 * ===============================
 */

// Create assignment
router.post(
    "/",
    protect,
    authorizeRoles("faculty"),
    upload.single("file"),
    createAssignment
);

// Get assignments created by teacher
router.get(
    "/faculty",
    protect,
    authorizeRoles("faculty"),
    getAssignmentsByTeacher
);

// Delete assignment
router.delete(
    "/:id",
    protect,
    authorizeRoles("faculty"),
    deleteAssignment
);

/**
 * ===============================
 * STUDENT ROUTES
 * ===============================
 */

// Get assignments for logged-in student
router.get(
    "/student",
    protect,
    authorizeRoles("student"),
    getAssignmentsForStudent
);

/**
 * ===============================
 * COMMON ROUTE
 * ===============================
 */

// Assignment detail page (student + teacher)
router.get(
    "/:id",
    protect,
    authorizeRoles("student", "faculty"),
    getAssignmentById
);

export default router;
