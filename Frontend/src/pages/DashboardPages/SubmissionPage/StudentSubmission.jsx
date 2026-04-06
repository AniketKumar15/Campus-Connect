import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubmissionContext from "../../../contexts/SubmissionContext/SubmissionContext";

const StudentSubmission = () => {
    const { mySubmission, fetchMySubmission, loading } = useContext(SubmissionContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMySubmission();
    }, []);

    /* ---------- Loading ---------- */
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-slate-500 font-bold font-sans">
                Loading submissions...
            </div>
        );
    }

    if (!mySubmission || mySubmission.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center mt-10 rounded-3xl p-10 bg-slate-200 border border-slate-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),0_5px_10px_rgba(0,0,0,0.05)] mx-6 text-slate-500 font-bold font-sans">
                You don’t have any submissions
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 font-sans pb-16">
            <h1 className="text-3xl font-extrabold text-slate-800 drop-shadow-sm mb-8">
                My Submissions
            </h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mySubmission.map((submission) => {
                    const assignment = submission.assignmentId;

                    return (
                        <div
                            key={submission._id}
                            className="p-6 rounded-3xl bg-slate-200 border-t border-l border-white shadow-[8px_12px_20px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)] hover:shadow-[12px_16px_25px_rgba(0,0,0,0.15)] hover:-translate-y-1 flex flex-col group transition-all duration-300"
                        >
                            {/* Assignment Title */}
                            <div className="flex justify-between items-start gap-4">
                                <h2
                                    className="cursor-pointer font-extrabold text-lg text-slate-800 drop-shadow-sm leading-snug group-hover:text-blue-700 transition-colors"
                                    onClick={() =>
                                        navigate(`/assignments/${assignment?._id}`)
                                    }
                                >
                                    {assignment?.title || "Untitled Assignment"}
                                </h2>
                                
                                {/* Status */}
                                <span
                                    className={`shrink-0 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)] border border-white/20 mt-1
                                        ${submission.status === "submitted"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    {submission.status}
                                </span>
                            </div>

                            {/* Assignment Info */}
                            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold font-mono text-slate-600 border-b-2 border-slate-300/50 pb-4">
                                <span className="px-2 py-1 bg-slate-300/50 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)]">
                                    📘 {assignment?.subject}
                                </span>
                                <span className="px-2 py-1 bg-slate-300/50 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)]">
                                    🎓 {assignment?.course}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="mt-3 text-sm font-bold text-slate-600 mb-4">
                                <p>📅 Due: {assignment?.deadline ? new Date(assignment.deadline).toLocaleDateString() : 'N/A'}</p>
                            </div>

                            {/* File + Feedback Section */}
                            <div className="mt-auto space-y-4">

                                {/* File Button */}
                                <a
                                    href={submission.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-slate-100 text-blue-600 border border-slate-300 border-b-slate-400 border-r-slate-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),2px_3px_5px_rgba(0,0,0,0.1)] hover:-translate-y-[1px] hover:shadow-[3px_4px_6px_rgba(0,0,0,0.12)] active:translate-y-[1px] active:shadow-none transition-all font-extrabold"
                                >
                                    📎 View Uploaded File
                                </a>

                                {/* Feedback */}
                                {submission.feedback ? (
                                    <div className="p-4 rounded-xl border border-t-slate-400 border-l-slate-400 border-b-white border-r-white bg-slate-100 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] relative mt-2">
                                        <p className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 absolute -top-2 left-4 bg-slate-100 px-1">
                                            Teacher Feedback
                                        </p>

                                        <p className="text-sm font-bold text-slate-700 leading-relaxed mt-1">
                                            {submission.feedback}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-xs font-bold text-slate-400 italic text-center py-2">
                                        No feedback yet
                                    </div>
                                )}

                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentSubmission;