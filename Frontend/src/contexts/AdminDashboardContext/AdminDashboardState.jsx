import { useState, useCallback } from "react";
import AdminDashboardContext from "./AdminDashboardContext";
import { toast } from "../../Toaster/toast";

const AdminDashboardState = ({ children }) => {
    const hostUrl = import.meta.env.VITE_URL;

    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        activeAssignments: 0,
        totalSubmissions: 0,
        pendingApprovals: 0
    });
    
    const [loading, setLoading] = useState(true);

    const getAdminDashboardData = useCallback(async (token) => {
        setLoading(true);
        try {
            const response = await fetch(`${hostUrl}/api/admin-dashboard`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Failed to load dashboard data");
            }

            if (data.success) {
                setDashboardData(data.dashboardData);
            }
        } catch (error) {
            console.error("Dashboard Fetch Error:", error);
            toast.error(error.message || "Error fetching admin data");
        } finally {
            setLoading(false);
        }
    }, [hostUrl]);

    return (
        <AdminDashboardContext.Provider value={{ dashboardData, loading, getAdminDashboardData }}>
            {children}
        </AdminDashboardContext.Provider>
    );
};

export default AdminDashboardState;
