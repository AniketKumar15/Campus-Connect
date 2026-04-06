import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import AuthContext from "../../../contexts/AuthContext/AuthContext";
import AssignmentContext from "../../../contexts/AssignmentContext/AssignmentContext";
import { FiClipboard, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AllAssigmentAdmin = () => {
    const { token } = useContext(AuthContext);
    const { assignments, loading, getAllAssignmentsAdmin } = useContext(AssignmentContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            getAllAssignmentsAdmin(token);
        }
        // eslint-disable-next-line
    }, [token]);

    const isDeadlinePassed = (deadline) => {
        return new Date() > new Date(deadline);
    };

    return (
        <div className="pb-16 pt-8 font-sans text-slate-800">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 drop-shadow-sm flex items-center gap-3">
                            <FiClipboard className="text-slate-600" /> All Assignments Archive
                        </h1>
                        <p className="mt-2 text-slate-600 font-medium">
                            Platform-wide overview of all created assignments.
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
                            <p className="text-slate-600 font-medium animate-pulse text-lg">Loading assignments...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr className="border-b-[3px] border-slate-300 shadow-[0_2px_0_rgba(255,255,255,0.5)]">
                                        <th className="p-4 font-extrabold text-slate-700 drop-shadow-sm uppercase tracking-wider text-sm">Title / Subject</th>
                                        <th className="p-4 font-extrabold text-slate-700 drop-shadow-sm uppercase tracking-wider text-sm">Course Details</th>
                                        <th className="p-4 font-extrabold text-slate-700 drop-shadow-sm uppercase tracking-wider text-sm">Created By</th>
                                        <th className="p-4 font-extrabold text-slate-700 drop-shadow-sm uppercase tracking-wider text-sm">Deadline</th>
                                        <th className="p-4 font-extrabold text-slate-700 drop-shadow-sm uppercase tracking-wider text-sm">Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {(!assignments || assignments.length === 0) ? (
                                        <tr>
                                            <td colSpan="5" className="text-center p-8 font-medium text-slate-500">
                                                No assignments found.
                                            </td>
                                        </tr>
                                    ) : (
                                        assignments.map((assignment) => {
                                            const status = isDeadlinePassed(assignment.deadline) ? "Closed" : "Active";
                                            return (
                                                <tr key={assignment._id} className="border-b border-slate-300/50 hover:bg-slate-300/30 transition-colors" onClick={() =>
                                                    navigate(`/assignments/${assignment._id}`)
                                                }>
                                                    <td className="p-4">
                                                        <div className="font-bold text-slate-800 text-lg">{assignment.title}</div>
                                                        <div className="text-sm font-semibold text-slate-500 bg-slate-100 rounded px-2 py-0.5 inline-block mt-1 shadow-inner border border-slate-200">
                                                            {assignment.subject}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-semibold text-slate-700">{assignment.course}</div>
                                                        <div className="text-sm text-slate-500">Sem {assignment.semester}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-semibold text-slate-700">{assignment.teacherId?.name || "Unknown"}</div>
                                                        <div className="text-sm text-slate-500">{assignment.teacherId?.email}</div>
                                                    </td>
                                                    <td className="p-4 text-slate-600 font-medium">
                                                        <span className="flex items-center gap-1.5">
                                                            <FiClock className={status === "Closed" ? 'text-red-500' : 'text-emerald-500'} />
                                                            {new Date(assignment.deadline).toLocaleDateString()}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)] ${status === 'Active'
                                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                            : 'bg-red-100 text-red-700 border border-red-200'
                                                            }`}>
                                                            {status}
                                                        </span>
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

export default AllAssigmentAdmin;