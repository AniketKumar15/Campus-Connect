import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import Resource from "../models/Resource.js";
import Student from "../models/Student.js";

export const getStudentDashboardData = async (req, res) => {
    try {
        const studentId = req.user.id;
        
        // 1. Get student details
        const student = await Student.findOne({ user: studentId });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student record not found" });
        }
        
        // 2. Total Approved Resources (based on course)
        const totalResources = await Resource.countDocuments({
            course: student.course,
            status: "approved"
        });

        // 3. Completed Assignments (Submissions by this user)
        const submissions = await Submission.find({ studentId: studentId });
        const completedAssignments = submissions.length;
        const submittedAssignmentIds = submissions.map(s => s.assignmentId.toString());

        // 4. All assignments for this course
        // Sorting by deadline strictly ascending to easily grab focusTask
        const assignments = await Assignment.find({ course: student.course }).sort({ deadline: 1 });
        
        // Filter pending: not submitted yet and deadline is in the future
        const now = new Date();
        const pendingList = assignments.filter(a => {
            const isSubmitted = submittedAssignmentIds.includes(a._id.toString());
            const isNotExpired = new Date(a.deadline) > now;
            return !isSubmitted && isNotExpired;
        });

        const pendingAssignments = pendingList.length;

        // 5. Focus Task (nearest pending assignment)
        const focusTask = pendingList.length > 0 ? pendingList[0] : null;

        res.status(200).json({
            success: true,
            stats: {
                pending: pendingAssignments,
                completed: completedAssignments,
                resources: totalResources
            },
            focusTask
        });
        
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ success: false, message: "Server error retrieving dashboard data" });
    }
};
