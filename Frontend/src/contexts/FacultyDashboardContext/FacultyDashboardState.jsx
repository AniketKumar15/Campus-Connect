import React, { useState } from "react";
import FacultyDashboardContext from "./FacultyDashboardContext";
import { toast } from "../../Toaster/toast";

const FacultyDashboardState = (props) => {
    const host = import.meta.env.VITE_URL;

    const [dashboard, setDashboard] = useState({
        stats: {
            totalBlogs: 0,
            totalAssignments: 0,
            totalResources: 0
        },
        latestAssignment: null,
        loading: true
    });

    const getFacultyDashboard = async (token) => {
        try {
            setDashboard(prev => ({ ...prev, loading: true }));
            const response = await fetch(`${host}/api/dashboard/faculty`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const json = await response.json();
            
            if (json.success) {
                setDashboard({
                    stats: json.data.stats,
                    latestAssignment: json.data.latestAssignment,
                    loading: false
                });
            } else {
                toast.error(json.error || "Failed to fetch dashboard data");
                setDashboard(prev => ({ ...prev, loading: false }));
            }
        } catch (error) {
            console.error("Error fetching faculty dashboard:", error);
            toast.error("An error occurred while fetching dashboard data");
            setDashboard(prev => ({ ...prev, loading: false }));
        }
    };

    return (
        <FacultyDashboardContext.Provider value={{ dashboard, getFacultyDashboard }}>
            {props.children}
        </FacultyDashboardContext.Provider>
    );
};

export default FacultyDashboardState;
