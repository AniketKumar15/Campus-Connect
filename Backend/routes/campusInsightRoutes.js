import express from "express";
import {
    createInsight,
    getAllInsights,
    getAllInsightsAdmin,
    getInsightById,
    updateInsight,
    deleteInsight,
    toggleLikeInsight,
    approveInsight,
    getInsightsByAuthor
} from "../controllers/campusInsightController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();


// ===============================
// PUBLIC ROUTES
// ===============================

// Get all approved insights
router.get("/", getAllInsights);
router.get("/my-insights", protect, getInsightsByAuthor); // For users to see their own insights (approved + unapproved)


// ===============================
// ADMIN ROUTES (Protected + Role)
// ===============================

// Get all insights (including unapproved)
router.get("/admin/all", protect, authorizeRoles("admin"), getAllInsightsAdmin);

// Approve / Reject insight
router.put(
    "/admin/approve/:id",
    protect,
    authorizeRoles("admin"),
    approveInsight
);


// ===============================
// USER ROUTES (Protected)
// ===============================

// Create insight
router.post("/", protect, upload.single("file"), createInsight);

// Update insight
router.put("/:id", protect, upload.single("file"), updateInsight);

// Delete insight
router.delete("/:id", protect, deleteInsight);

// Like / Unlike
router.put("/like/:id", protect, toggleLikeInsight);


// ===============================
// LAST (IMPORTANT)
// ===============================

// Get single insight (keep LAST always)
router.get("/:id", getInsightById);


export default router;