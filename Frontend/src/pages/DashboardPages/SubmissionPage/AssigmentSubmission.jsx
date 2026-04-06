import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SubmissionContext from "../../../contexts/SubmissionContext/SubmissionContext";
import { FiEye, FiMessageSquare, FiUser } from "react-icons/fi";

const AssigmentSubmission = () => {
    const { id } = useParams();
    const {
        fetchSubmissionsByAssignment,
        submissions,
        loading,
        reviewSubmission,
    } = useContext(SubmissionContext);

    const [feedbacks, setFeedbacks] = useState({});

    useEffect(() => {
        fetchSubmissionsByAssignment(id);
    }, [id]);

    const handleReview = async (submissionId) => {
        const feedback = feedbacks[submissionId];
        if (!feedback) return;

        const success = await reviewSubmission(submissionId, feedback);
        if (success) fetchSubmissionsByAssignment(id);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-slate-500 font-bold font-sans">
                Loading submissions...
            </div>
        );
    }

    if (!submissions || submissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center mt-10 rounded-3xl p-10 bg-slate-200 border border-slate-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),0_5px_10px_rgba(0,0,0,0.05)] mx-6 text-slate-500 font-bold font-sans">
                No submissions yet
            </div>
        );
    }

    return (
        <div className="text-slate-800 font-sans pb-16">

            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-800 drop-shadow-sm mb-2">
                        Submissions
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                        Review and manage student submissions
                    </p>
                </div>

                {/* List */}
                <div className="space-y-8">
                    {submissions.map((submission) => {
                        const isReviewed = submission.status === "reviewed";

                        return (
                            <div
                                key={submission._id}
                                className="rounded-3xl border-t border-l border-white shadow-[8px_12px_20px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)] bg-slate-200 p-8"
                            >
                                {/* Top Section */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                                    {/* Student Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-full bg-slate-100 border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-slate-600">
                                            <FiUser className="text-xl" />
                                        </div>

                                        <div>
                                            <p className="font-extrabold text-xl text-slate-800 drop-shadow-sm">
                                                {submission.studentId?.name || "Unknown Student"}
                                            </p>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                                                Submitted on {submission.submittedAt?.slice(0, 10)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <span
                                        className={`shrink-0 text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)] border border-white/20 text-center ${isReviewed
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {isReviewed ? "Reviewed" : "Pending"}
                                    </span>
                                </div>

                                {/* Divider */}
                                <div className="my-6 border-t-2 border-slate-300"></div>

                                {/* Actions Row */}
                                <div className="flex flex-col md:flex-row md:items-start gap-6">

                                    {/* File Button */}
                                    <a
                                        href={submission.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 text-blue-600 border border-slate-300 border-b-slate-400 border-r-slate-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),2px_3px_5px_rgba(0,0,0,0.1)] hover:-translate-y-[1px] hover:shadow-[3px_4px_6px_rgba(0,0,0,0.12)] active:translate-y-[1px] active:shadow-none transition-all font-extrabold h-auto"
                                    >
                                        <FiEye className="text-lg" /> View File
                                    </a>

                                    {/* Feedback Input */}
                                    {isReviewed || <div className="flex-1 w-full">
                                        <textarea
                                            placeholder="Write constructive feedback for the student..."
                                            value={feedbacks[submission._id] || ""}
                                            onChange={(e) =>
                                                setFeedbacks({
                                                    ...feedbacks,
                                                    [submission._id]: e.target.value,
                                                })
                                            }
                                            disabled={isReviewed}
                                            rows={2}
                                            className="w-full p-4 rounded-xl text-sm border border-t-slate-400 border-l-slate-400 border-b-white border-r-white bg-slate-100 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 font-bold disabled:opacity-50 resize-y transition-all"
                                        />
                                    </div>}

                                    {/* Review Button */}
                                    <button
                                        onClick={() => handleReview(submission._id)}
                                        disabled={isReviewed}
                                        className={`shrink-0 px-8 py-3.5 rounded-xl font-extrabold tracking-wide transition-all h-auto mt-auto mb-auto ${isReviewed
                                            ? "bg-slate-300 text-slate-500 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,1)] border border-slate-400 cursor-not-allowed"
                                            : "bg-gradient-to-b from-emerald-500 to-emerald-700 text-white shadow-[0_5px_10px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-[3px] border-emerald-800 active:border-b-0 active:translate-y-[3px]"
                                            }`}
                                    >
                                        {isReviewed ? "✓ Reviewed" : "Submit Review"}
                                    </button>
                                </div>

                                {/* Existing Feedback */}
                                {submission.feedback && (
                                    <div className="mt-6 p-5 rounded-xl border border-t-slate-400 border-l-slate-400 border-b-white border-r-white bg-slate-100 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] relative"
                                    >
                                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-extrabold text-slate-500 absolute -top-3 left-4 bg-slate-100 px-2">
                                            <FiMessageSquare /> Feedback Given
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 leading-relaxed mt-1">
                                            {submission.feedback}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div >
    );
};

export default AssigmentSubmission;