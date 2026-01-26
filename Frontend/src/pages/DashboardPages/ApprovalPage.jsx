import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiX } from "react-icons/fi";

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
            <p className="text-white px-8 pt-8">
                Loading...
            </p>
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
        <div className="px-8 pt-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-white">
                    Approval
                </h1>
                <p className="text-sm text-slate-400">
                    Manage pending resources
                </p>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-xl divide-y divide-white/10">
                {pendingResources?.length === 0 && (
                    <p className="text-slate-400 p-4">
                        No pending approvals 🎉
                    </p>
                )}

                {pendingResources?.map((r) => (
                    <div
                        key={r._id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-white/5"
                    >
                        {/* LEFT SIDE */}
                        <div className="flex items-start gap-3">
                            {/* Profile Image */}
                            <img
                                src={r.uploadedBy?.profileImage || "/avatar.png"}
                                alt={r.uploadedBy?.name}
                                className="w-10 h-10 rounded-full object-cover border border-white/10 bg-white"
                            />

                            <div>
                                {/* Title + Role */}
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-white">
                                        {r.title}
                                    </h3>
                                    <UploaderBadge role={r.uploadedBy?.role} />
                                </div>

                                {/* Meta */}
                                <p className="text-xs text-slate-400">
                                    {r.course} • Sem {r.semester} • {r.category}
                                </p>

                                {/* Uploader Name */}
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Uploaded by{" "}
                                    <span className="text-slate-300 font-medium">
                                        {r.uploadedBy?.name || "Unknown"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="flex items-center gap-3">
                            <a
                                href={r.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-cyan-400 text-sm"
                            >
                                View
                            </a>

                            <button
                                onClick={() => handleApprove(r._id)}
                                className="flex items-center gap-1 px-3 py-1 rounded-md
                           bg-emerald-500/10 text-emerald-400
                           hover:bg-emerald-500/20"
                            >
                                <FiCheck />
                                Approve
                            </button>

                            <button
                                onClick={() => handleReject(r._id)}
                                className="flex items-center gap-1 px-3 py-1 rounded-md
                           bg-red-500/10 text-red-400
                           hover:bg-red-500/20"
                            >
                                <FiX />
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
        text-xs px-2 py-0.5 rounded-full font-medium
        ${isFaculty
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"}
      `}
        >
            {isFaculty ? "Faculty" : "Student"}
        </span>
    );
};