import express from "express";
import {
    createAssignment,
    getAssignmentsForStudent,
    getAssignmentsByTeacher,
    getAssignmentById,
    deleteAssignment,
    getAllAssignments,
} from "../controllers/assignmentController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.get("/all", getAllAssignments);


/**
 * ===============================
 * TEACHER ROUTES
 * ===============================
 */

// Create assignment
router.post(
    "/",
    protect,
    authorizeRoles("faculty", "admin"),
    upload.single("file"),
    createAssignment
);

// Get assignments created by teacher
router.get(
    "/faculty",
    protect,
    authorizeRoles("faculty", "admin"),
    getAssignmentsByTeacher
);

// Delete assignment
router.delete(
    "/:id",
    protect,
    authorizeRoles("faculty", "admin"),
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
    authorizeRoles("student", "admin"),
    getAssignmentsForStudent
);

/**
 * ===============================
 * COMMON ROUTE (DETAIL PAGE)
 * ===============================
 * Must be last, otherwise it will conflict with admin/faculty/student routes
 */
router.get(
    "/:id",
    protect,
    authorizeRoles("student", "faculty", "admin"),
    getAssignmentById
);

export default router;