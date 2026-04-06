import express from "express";
import { getStudentDashboardData } from "../controllers/studentDashboardController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("student"), getStudentDashboardData);

export default router;
