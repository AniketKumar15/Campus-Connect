import { useContext, useEffect } from "react";
import CampusInsightContext from "../contexts/CampusInsightContext/CampusInsightContext";


const InsightApproval = () => {
    const {
        insights,
        loading,
        getAllInsightsAdmin,
        approveInsight,
    } = useContext(CampusInsightContext);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            getAllInsightsAdmin(token);
        }
    }, []);

    if (loading) {
        return <div className="p-6 text-slate-600">Loading insights...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-8">
                Insight Approval Panel
            </h1>

            {!insights || insights.length === 0 ? (
                <p className="text-slate-500">No insights found</p>
            ) : (
                <div className="space-y-6">
                    {insights.map((insight) => (
                        <div
                            key={insight._id}
                            className="bg-slate-200 p-6 rounded-2xl shadow-md border border-slate-300"
                        >
                            {/* Image */}
                            <img
                                src={insight.coverImage}
                                alt={insight.title}
                                className="w-full h-52 object-cover rounded-xl mb-4"
                            />

                            {/* Title */}
                            <h2 className="text-xl font-bold text-slate-800">
                                {insight.title}
                            </h2>

                            {/* Author */}
                            <p className="text-sm text-slate-500 mb-2">
                                By {insight.author?.name} ({insight.author?.role})
                            </p>

                            {/* Status */}
                            <p
                                className={`text-sm font-bold mb-4 ${insight.isApproved
                                    ? "text-green-600"
                                    : "text-yellow-600"
                                    }`}
                            >
                                {insight.isApproved ? "Approved" : "Pending"}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() =>
                                        approveInsight(insight._id, true, token)
                                    }
                                    className="px-4 py-2 rounded-lg bg-green-500 text-white font-bold shadow"
                                >
                                    Approve
                                </button>

                                <button
                                    onClick={() =>
                                        approveInsight(insight._id, false, token)
                                    }
                                    className="px-4 py-2 rounded-lg bg-red-500 text-white font-bold shadow"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InsightApproval;