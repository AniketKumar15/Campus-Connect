import User from "../models/User.js";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import Resource from "../models/Resource.js";
import CampusInsight from "../models/CampusInsight.js";

export const getAdminDashboardData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeAssignments = await Assignment.countDocuments({ deadline: { $gt: Date.now() } });
        const totalSubmissions = await Submission.countDocuments();

        const pendingResources = await Resource.countDocuments({ status: "pending" });
        const pendingInsights = await CampusInsight.countDocuments({ isApproved: false });
        const pendingApprovals = pendingResources + pendingInsights;

        res.status(200).json({
            success: true,
            dashboardData: {
                totalUsers,
                activeAssignments,
                totalSubmissions,
                pendingApprovals
            }
        });
    } catch (error) {
        console.error("Admin Dashboard Fetch Error:", error);
        res.status(500).json({ success: false, message: "Server error fetching admin metrics" });
    }
};
