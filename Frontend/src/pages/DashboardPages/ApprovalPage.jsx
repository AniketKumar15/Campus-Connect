import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiX, FiFileText } from "react-icons/fi";

import ResourceContext from "../../contexts/ResourceContext/ResourceContext";
import AuthContext from "../../contexts/AuthContext/AuthContext";

const ApprovalPage = () => {
    const {
        resources,
        setResources,
        loading,
        getAllResourcesAdmin,
        updateResourceStatus,
    } = useContext(ResourceContext);

    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    // -------------------- AUTH + FETCH ADMIN DATA --------------------
    useEffect(() => {
        if (!user) return;

        if (user.role !== "admin") {
            navigate("/");
            return;
        }

        // fetch ALL resources for admin (pending + approved + rejected)
        getAllResourcesAdmin(token);
    }, [user, token, navigate]);

    // -------------------- LOADING --------------------
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-slate-500 font-bold font-sans">
                Loading...
            </div>
        );
    }

    // -------------------- FILTER PENDING --------------------
    const pendingResources = resources?.filter(
        (r) => r.status === "pending"
    );

    // -------------------- ACTIONS --------------------
    const handleApprove = async (id) => {
        await updateResourceStatus(
            id,
            { status: "approved" },
            token
        );

        setResources(prev =>
            prev.filter(r => r._id !== id)
        );

        // refresh admin list
        getAllResourcesAdmin(token);
    };

    const handleReject = async (id) => {
        const reason = prompt("Enter rejection reason");
        if (!reason) return;

        await updateResourceStatus(
            id,
            { status: "rejected", rejectionReason: reason },
            token
        );

        setResources(prev =>
            prev.filter(r => r._id !== id)
        );
        // refresh admin list
        getAllResourcesAdmin(token);
    };

    // -------------------- UI --------------------
    return (
        <div className="px-8 pt-8 font-sans pb-16">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-800 drop-shadow-sm">
                    Approval Dashboard
                </h1>
                <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
                    Manage pending resources
                </p>
            </div>

            <div className="bg-slate-200 border border-slate-400 border-t-slate-500 border-l-slate-500 shadow-[inset_3px_5px_10px_rgba(0,0,0,0.15),0_2px_0_rgba(255,255,255,0.8)] rounded-3xl divide-y-2 divide-slate-300 overflow-hidden">
                {pendingResources?.length === 0 && (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <span className="text-4xl mb-4 text-slate-400">🎉</span>
                        <p className="text-lg font-extrabold text-slate-600 drop-shadow-sm">
                            No pending approvals
                        </p>
                        <p className="text-sm font-bold text-slate-500 mt-1">
                            Everything is up to date!
                        </p>
                    </div>
                )}

                {pendingResources?.map((r) => (
                    <div
                        key={r._id}
                        className="flex flex-col md:flex-row md:items-center justify-between px-6 py-5 hover:bg-slate-300/30 transition-all font-bold gap-4"
                    >
                        {/* LEFT SIDE */}
                        <div className="flex items-start gap-4">
                            {/* Profile Image */}
                            <img
                                src={r.uploadedBy?.profileImage || "/avatar.png"}
                                alt={r.uploadedBy?.name}
                                className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-[0_3px_6px_rgba(0,0,0,0.15),inset_1px_1px_3px_rgba(0,0,0,0.1)] bg-slate-100"
                            />

                            <div>
                                {/* Title + Role */}
                                <div className="flex items-center gap-3">
                                    <h3 className="font-extrabold text-lg text-slate-800 drop-shadow-sm leading-tight max-w-[300px] truncate">
                                        {r.title}
                                    </h3>
                                    <UploaderBadge role={r.uploadedBy?.role} />
                                </div>

                                {/* Meta */}
                                <div className="flex gap-2 text-xs font-bold font-mono text-slate-600 mt-2 mb-1">
                                    <span className="px-2 py-1 bg-slate-300/50 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)]">
                                        {r.course}
                                    </span>
                                    <span className="px-2 py-1 bg-slate-300/50 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)]">
                                        Sem {r.semester}
                                    </span>
                                    <span className="px-2 py-1 bg-slate-300/50 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)]">
                                        {r.category}
                                    </span>
                                </div>

                                {/* Uploader Name */}
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">
                                    Uploaded by{" "}
                                    <span className="text-indigo-600 font-extrabold ml-1">
                                        {r.uploadedBy?.name || "Unknown"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="flex flex-wrap items-center gap-3 ml-18 md:ml-0">
                            <a
                                href={r.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-blue-600 border border-slate-300 border-b-slate-400 border-r-slate-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),2px_3px_5px_rgba(0,0,0,0.1)] hover:-translate-y-[1px] hover:shadow-[3px_4px_6px_rgba(0,0,0,0.12)] active:translate-y-[1px] active:shadow-none transition-all font-extrabold"
                            >
                                <FiFileText />
                                View
                            </a>

                            <button
                                onClick={() => handleApprove(r._id)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-100 text-green-700 border border-green-300 border-b-green-400 border-r-green-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),2px_3px_5px_rgba(0,0,0,0.1)] hover:-translate-y-[1px] hover:shadow-[3px_4px_6px_rgba(0,0,0,0.12)] active:translate-y-[1px] active:shadow-none transition-all font-extrabold"
                            >
                                <FiCheck strokeWidth={3} />
                                Approve
                            </button>

                            <button
                                onClick={() => handleReject(r._id)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-100 text-red-700 border border-red-300 border-b-red-400 border-r-red-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),2px_3px_5px_rgba(0,0,0,0.1)] hover:-translate-y-[1px] hover:shadow-[3px_4px_6px_rgba(0,0,0,0.12)] active:translate-y-[1px] active:shadow-none transition-all font-extrabold"
                            >
                                <FiX strokeWidth={3} />
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApprovalPage;

const UploaderBadge = ({ role }) => {
    const isFaculty = role === "faculty";

    return (
        <span
            className={`
        text-[10px] uppercase font-extrabold px-2.5 py-1 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)] shrink-0
        ${isFaculty
                    ? "bg-green-100 text-green-800 border-white/40"
                    : "bg-blue-100 text-blue-800 border-white/40"
                } border`}
        >
            {isFaculty ? "Faculty" : "Student"}
        </span>
    );
};