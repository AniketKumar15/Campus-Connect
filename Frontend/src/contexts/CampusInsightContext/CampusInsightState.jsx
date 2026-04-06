import { useState, useEffect } from "react";
import CampusInsightContext from "./CampusInsightContext.jsx";
import { toast } from "../../Toaster/toast";

const CampusInsightState = ({ children }) => {
    const hostUrl = import.meta.env.VITE_URL;

    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);

    // -------------------- GET ALL APPROVED INSIGHTS --------------------
    const getAllInsights = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${hostUrl}/api/campus-insights`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Something went wrong");

            setInsights(data.insights);
        } catch (error) {
            setInsights(null);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // -------------------- GET ALL INSIGHTS (ADMIN) --------------------
    const getAllInsightsAdmin = async (token) => {
        setLoading(true);
        try {
            const res = await fetch(`${hostUrl}/api/campus-insights/admin/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setInsights(data.insights);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getInsightsByAuthor = async (token) => {
        setLoading(true);
        try {
            const res = await fetch(`${hostUrl}/api/campus-insights/my-insights`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setInsights(data.insights);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };


    // -------------------- GET SINGLE INSIGHT --------------------
    const getInsightById = async (id) => {
        try {
            const res = await fetch(`${hostUrl}/api/campus-insights/${id}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            return data.insight;
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    // -------------------- CREATE INSIGHT --------------------
    const createInsight = async (formData, token) => {
        try {
            const res = await fetch(`${hostUrl}/api/campus-insights`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            toast.success("Insight created (waiting for approval)");
            getAllInsights();
            return data.insight;
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    // -------------------- UPDATE INSIGHT --------------------
    const updateInsight = async (id, formData, token) => {
        try {
            const res = await fetch(`${hostUrl}/api/campus-insights/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            toast.success("Insight updated (needs re-approval)");
            getAllInsights();
            return data.insight;
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    // -------------------- DELETE INSIGHT --------------------
    const deleteInsight = async (id, token) => {
        try {
            const res = await fetch(`${hostUrl}/api/campus-insights/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            toast.success("Insight deleted");
            getAllInsights();
        } catch (error) {
            toast.error(error.message);
        }
    };

    // -------------------- LIKE / UNLIKE --------------------
    const toggleLikeInsight = async (id, token) => {
        try {
            const res = await fetch(`${hostUrl}/api/campus-insights/like/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            // update UI instantly (optional refresh)
            getAllInsights();

            return data;
        } catch (error) {
            toast.error(error.message);
        }
    };

    // -------------------- APPROVE / REJECT (ADMIN) --------------------
    const approveInsight = async (id, isApproved, token) => {
        try {
            const res = await fetch(`${hostUrl}/api/campus-insights/admin/approve/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ isApproved }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            toast.success(`Insight ${isApproved ? "approved" : "rejected"}`);
            getAllInsightsAdmin(token);

            return data.insight;
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    // -------------------- AUTO FETCH --------------------
    useEffect(() => {
        getAllInsights();
    }, []);

    return (
        <CampusInsightContext.Provider
            value={{
                insights,
                setInsights,
                loading,
                getAllInsights,
                getInsightsByAuthor,
                getAllInsightsAdmin,
                getInsightById,
                createInsight,
                updateInsight,
                deleteInsight,
                toggleLikeInsight,
                approveInsight,
            }}
        >
            {children}
        </CampusInsightContext.Provider>
    );
};

export default CampusInsightState;