import express from "express";
import {
    submitAssignment,
    getSubmissionsByAssignment,
    getMySubmission,
    reviewSubmission,
    getAllSubmissions,
} from "../controllers/submissionController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

/**
 * Student
 */
router.post(
    "/",
    protect,
    authorizeRoles("student"),
    upload.single("file"),
    submitAssignment
);

router.get(
    "/my-submission",
    protect,
    authorizeRoles("student"),
    getMySubmission
);

/**
 * Teacher
 */
router.get(
    "/assignment/:assignmentId",
    protect,
    authorizeRoles("faculty", "admin"),
    getSubmissionsByAssignment
);

router.patch(
    "/review/:submissionId",
    protect,
    authorizeRoles("faculty"),
    reviewSubmission
);

/**
 * Admin
 */
router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    getAllSubmissions
);

export default router;
