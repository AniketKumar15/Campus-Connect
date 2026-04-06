import { useState, useCallback } from "react";
import StudentDashboardContext from "./StudentDashboardContext";
import { toast } from "../../Toaster/toast";

const StudentDashboardState = ({ children }) => {
    const hostUrl = import.meta.env.VITE_URL;

    const [stats, setStats] = useState({ pending: 0, completed: 0, resources: 0 });
    const [focusTask, setFocusTask] = useState(null);
    const [loading, setLoading] = useState(true);

    const getDashboardData = useCallback(async (token) => {
        setLoading(true);
        try {
            const response = await fetch(`${hostUrl}/api/student-dashboard`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Failed to load dashboard data");
            }

            if (data.success) {
                setStats(data.stats);
                setFocusTask(data.focusTask);
            }
        } catch (error) {
            console.error("Dashboard Fetch Error:", error);
            toast.error(error.message || "Error fetching dashboard data");
        } finally {
            setLoading(false);
        }
    }, [hostUrl]);

    return (
        <StudentDashboardContext.Provider value={{ stats, focusTask, loading, getDashboardData }}>
            {children}
        </StudentDashboardContext.Provider>
    );
};

export default StudentDashboardState;
