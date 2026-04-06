import express from "express";
import { getAdminDashboardData } from "../controllers/adminDashboardController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getAdminDashboardData);

export default router;
