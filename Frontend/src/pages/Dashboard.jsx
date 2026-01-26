import { useContext } from "react";

import StudentDashboard from "../components/StudentDashboard";
import FacultyDashboard from "../components/FacultyDashboard";
import AdminDashboard from "../components/AdminDashboard";
import AuthContext from "../contexts/AuthContext/AuthContext";

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    if (!user) return null;

    return (
        <>
            {user.role === "student" && <StudentDashboard />}
            {user.role === "faculty" && <FacultyDashboard />}
            {user.role === "admin" && <AdminDashboard />}
        </>
    );
};

export default Dashboard;
