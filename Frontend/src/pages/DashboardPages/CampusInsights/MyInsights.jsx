import { useContext, useEffect } from "react";
import CampusInsightContext from "../../../contexts/CampusInsightContext/CampusInsightContext";
import AuthContext from "../../../contexts/AuthContext/AuthContext";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const MyInsights = () => {
    const {
        getInsightsByAuthor,
        deleteInsight,
        insights,
        loading,
    } = useContext(CampusInsightContext);

    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            getInsightsByAuthor(token);
        }
        // eslint-disable-next-line
    }, [token]);

    if (loading) {
        return <div className="p-6 text-slate-600 font-bold">Loading your insights...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-8 drop-shadow-sm">
                My Insights
            </h1>

            {/* We can use insights directly because getInsightsByAuthor already filters on backend */}
            {!insights || insights.length === 0 ? (
                <div className="bg-slate-200/60 p-8 rounded-2xl text-center shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05)] border border-slate-300">
                    <p className="text-slate-500 font-bold text-lg">You haven't posted anything yet.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    {insights.map((insight) => (
                        <div
                            key={insight._id}
                            className="bg-slate-200 p-6 rounded-3xl shadow-[8px_12px_20px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)] border-t border-l border-white/80"
                        >
                            {/* Image */}
                            <div className="w-full h-48 overflow-hidden rounded-2xl mb-4 shadow-[0_4px_6px_rgba(0,0,0,0.15)] border-2 border-slate-200">
                                <img
                                    src={insight.coverImage}
                                    alt={insight.title}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>

                            {/* Title */}
                            <h2 className="text-xl font-bold text-slate-800 line-clamp-2">
                                {insight.title}
                            </h2>

                            {/* Status & Likes Row */}
                            <div className="flex items-center justify-between mt-4 bg-slate-100 px-4 py-2 rounded-xl shadow-[inset_1px_2px_4px_rgba(0,0,0,0.05)] border border-slate-300/40">
                                <p
                                    className={`text-sm font-bold uppercase tracking-wider ${
                                        insight.isApproved
                                            ? "text-emerald-600"
                                            : "text-amber-600"
                                    }`}
                                >
                                    {insight.isApproved ? "Approved" : "Pending"}
                                </p>
                                <div className="flex items-center gap-1.5 text-slate-700 font-bold bg-slate-300/60 px-3 py-1 rounded-lg">
                                    <FiHeart className="text-rose-500 fill-rose-500/20" />
                                    <span>{insight.likes?.length || 0}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 mt-6 pt-5 border-t-2 border-slate-300/60">
                                <button
                                    onClick={() => navigate(`/dashboard/edit-insight/${insight._id}`)}
                                    className="px-6 py-2.5 bg-gradient-to-b from-blue-400 to-blue-600 text-white rounded-xl font-bold tracking-wide shadow-[0_5px_10px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-[3px] border-blue-800 active:border-b-0 active:translate-y-[3px] transition-all"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteInsight(insight._id, token)}
                                    className="px-6 py-2.5 bg-gradient-to-b from-red-400 to-red-600 text-white rounded-xl font-bold tracking-wide shadow-[0_5px_10px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-[3px] border-red-800 active:border-b-0 active:translate-y-[3px] transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyInsights;