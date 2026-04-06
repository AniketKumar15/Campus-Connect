import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import SubmissionContext from "../../../contexts/SubmissionContext/SubmissionContext";
import { FiFileText, FiExternalLink, FiCheckCircle, FiClock } from "react-icons/fi";

const AllSubmissionAdmin = () => {
    const { submissions, loading, fetchAllSubmissions } = useContext(SubmissionContext);

    useEffect(() => {
        fetchAllSubmissions();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="pb-16 pt-8 font-sans text-slate-800">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header Container */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 drop-shadow-sm flex items-center gap-3">
                            <FiFileText className="text-slate-600" /> All Submissions Archive
                        </h1>
                        <p className="mt-2 text-slate-600 font-medium">
                            Platform-wide overview of all student submissions and review statuses.
                        </p>
                    </div>
                </div>

                {/* Tactile Table Card Wrapper */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="rounded-3xl bg-slate-200 border-t border-l border-white shadow-[8px_12px_20px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)] p-6 overflow-hidden"
                >
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <p className="text-slate-600 font-medium animate-pulse text-lg">Loading submissions...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr className="border-b-[3px] border-slate-300 shadow-[0_2px_0_rgba(255,255,255,0.5)]">
                                        <th className="p-4 font-extrabold text-slate-700 drop-shadow-sm uppercase tracking-wider text-sm">Assignment Info</th>
                                        <th className="p-4 font-extrabold text-slate-700 drop-shadow-sm uppercase tracking-wider text-sm">Student</th>
                                        <th className="p-4 font-extrabold text-slate-700 drop-shadow-sm uppercase tracking-wider text-sm">Submitted At</th>
                                        <th className="p-4 font-extrabold text-slate-700 drop-shadow-sm uppercase tracking-wider text-sm">Status</th>
                                        <th className="p-4 font-extrabold text-slate-700 drop-shadow-sm uppercase tracking-wider text-sm text-right">Document</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {(!submissions || submissions.length === 0) ? (
                                        <tr>
                                            <td colSpan="5" className="text-center p-8 font-medium text-slate-500">
                                                No submissions found.
                                            </td>
                                        </tr>
                                    ) : (
                                        submissions.map((submission) => {
                                            const isReviewed = submission.status === "reviewed";
                                            return (
                                                <tr key={submission._id} className="border-b border-slate-300/50 hover:bg-slate-300/30 transition-colors">
                                                    <td className="p-4">
                                                        <div className="font-bold text-slate-800 text-lg">
                                                            {submission.assignmentId?.title || "Unknown Assignment"}
                                                        </div>
                                                        <div className="text-sm font-semibold text-slate-500 bg-slate-100 rounded px-2 py-0.5 inline-block mt-1 shadow-inner border border-slate-200">
                                                            {submission.assignmentId?.subject || "Unknown Subject"}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-semibold text-slate-700">{submission.studentId?.name || "Unknown"}</div>
                                                        <div className="text-sm text-slate-500">{submission.studentId?.email}</div>
                                                    </td>
                                                    <td className="p-4 text-slate-600 font-medium">
                                                        <span className="flex flex-col gap-0.5">
                                                            <span>{new Date(submission.submittedAt || submission.createdAt).toLocaleDateString()}</span>
                                                            <span className="text-xs text-slate-400 font-bold">{new Date(submission.submittedAt || submission.createdAt).toLocaleTimeString()}</span>
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center w-max gap-1.5 shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)] ${
                                                            isReviewed 
                                                                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                                                        }`}>
                                                            {isReviewed ? <FiCheckCircle size={14} /> : <FiClock size={14} />}
                                                            {submission.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right flex justify-end items-center h-full pt-6">
                                                        {submission.fileUrl ? (
                                                            <motion.a
                                                                whileTap={{ scale: 0.9 }}
                                                                href={submission.fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-blue-600 shadow-[0_4px_6px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.8)] border-b-2 border-slate-300 active:border-b-0 active:translate-y-0.5 transition-all text-sm font-bold w-max"
                                                            >
                                                                View File <FiExternalLink size={16} />
                                                            </motion.a>
                                                        ) : (
                                                            <span className="text-slate-400 text-sm font-semibold">No File</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AllSubmissionAdmin;