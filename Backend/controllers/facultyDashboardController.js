import CampusInsight from "../models/CampusInsight.js";
import Assignment from "../models/Assignment.js";
import Resource from "../models/Resource.js";

export const getFacultyDashboard = async (req, res) => {
    try {
        const facultyId = req.user.id;

        // Fetch counts in parallel
        const [totalBlogs, totalAssignments, totalResources] = await Promise.all([
            CampusInsight.countDocuments({ author: facultyId }),
            Assignment.countDocuments({ teacherId: facultyId }),
            Resource.countDocuments({ uploadedBy: facultyId })
        ]);

        // Get latest assignment (most recently created)
        const latestAssignment = await Assignment.findOne({ teacherId: facultyId })
            .sort({ createdAt: -1 })
            .select("title deadline createdAt");

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalBlogs,
                    totalAssignments,
                    totalResources
                },
                latestAssignment
            }
        });

    } catch (error) {
        console.error("Error fetching faculty dashboard:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};
