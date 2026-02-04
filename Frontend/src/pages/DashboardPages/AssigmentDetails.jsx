import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AssignmentContext from "../../contexts/AssignmentContext/AssignmentContext";
import AuthContext from "../../contexts/AuthContext/AuthContext";

const calculateRemainingTime = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;

    if (diff <= 0) return null;

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        total: diff,
    };
};

const AssignmentDetails = () => {
    const { id } = useParams();
    const { getAssignmentById } = useContext(AssignmentContext);
    const { user } = useContext(AuthContext);

    const [data, setData] = useState(null);
    const [remaining, setRemaining] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchAssignment = async () => {
            const res = await getAssignmentById(id, token);
            setData(res);
            setLoading(false);
        };
        fetchAssignment();
    }, [id]);

    useEffect(() => {
        if (!data?.assignment?.deadline) return;

        const timer = setInterval(() => {
            setRemaining(
                calculateRemainingTime(data.assignment.deadline)
            );
        }, 1000);

        return () => clearInterval(timer);
    }, [data]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64
        text-slate-500 dark:text-slate-400">
                Loading assignment…
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center
        text-slate-500 dark:text-slate-400">
                Assignment not found
            </div>
        );
    }

    const { assignment, isDeadlinePassed } = data;

    const urgencyColor =
        !remaining
            ? "border-rose-500/40 bg-rose-500/10"
            : remaining.total < 1000 * 60 * 60 * 24
                ? "border-amber-500/40 bg-amber-500/10"
                : "border-emerald-500/40 bg-emerald-500/10";

    return (
        <div className="min-h-screen
      bg-slate-50 dark:bg-[#05070F]
      text-slate-800 dark:text-white">
            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* HEADER */}
                <div className="mb-10">
                    <h1 className="text-4xl font-semibold tracking-tight mb-3">
                        {assignment.title}
                    </h1>

                    <div className="flex flex-wrap gap-4 text-sm
            text-slate-500 dark:text-slate-400">
                        <span>📘 {assignment.subject}</span>
                        <span>🎓 {assignment.course}</span>
                        <span>📚 Semester {assignment.semester}</span>
                        <span>🧑‍🏫 {user.name}</span>
                    </div>
                </div>

                {/* DEADLINE CARD */}
                <div
                    className={`mb-12 p-6 rounded-2xl border backdrop-blur-md ${urgencyColor}`}
                >
                    <p className="text-xs uppercase tracking-wide
            text-slate-500 dark:text-slate-400 mb-3">
                        Submission Deadline
                    </p>

                    <div className="flex flex-wrap items-center gap-6">
                        <span className="text-lg font-medium">
                            {assignment.deadline?.slice(0, 10)}
                        </span>

                        {!isDeadlinePassed && remaining ? (
                            <div className="flex gap-3">
                                {[
                                    { label: "Days", value: remaining.days },
                                    { label: "Hours", value: remaining.hours },
                                    { label: "Min", value: remaining.minutes },
                                    { label: "Sec", value: remaining.seconds },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="px-3 py-2 rounded-lg
                      bg-black/5 dark:bg-black/30
                      text-center min-w-16"
                                    >
                                        <p className="text-xl font-semibold">
                                            {item.value}
                                        </p>
                                        <p className="text-[10px]
                      text-slate-500 dark:text-slate-400">
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span className="text-rose-500 dark:text-rose-400 font-semibold">
                                Deadline Passed
                            </span>
                        )}

                        {/* ACTION */}
                        <div className="ml-auto">
                            <button
                                disabled={isDeadlinePassed}
                                className={`px-6 py-2 rounded-lg font-medium transition
                  ${isDeadlinePassed
                                        ? "bg-slate-400 dark:bg-slate-600 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-500 text-white"
                                    }`}
                            >
                                {user.role === "faculty"
                                    ? "See Submissions"
                                    : "Submit Assignment"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div
                    className="
            prose dark:prose-invert max-w-none
            prose-h1:text-3xl
            prose-h2:text-2xl
            prose-h3:text-xl
            prose-h2:font-semibold
            prose-p:leading-relaxed
          "
                    dangerouslySetInnerHTML={{
                        __html: assignment.description,
                    }}
                />

                {/* FILE */}
                {assignment.fileUrl && (
                    <div className="mt-6">
                        <a
                            href={assignment.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2
                text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            📎 View Attached File
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignmentDetails;
