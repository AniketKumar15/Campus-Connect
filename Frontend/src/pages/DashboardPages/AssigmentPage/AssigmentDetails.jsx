import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AssignmentContext from "../../../contexts/AssignmentContext/AssignmentContext";
import AuthContext from "../../../contexts/AuthContext/AuthContext";
import SubmissionModal from "../../../components/SubmissionModal";

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
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchAssignment = async () => {
            const res = await getAssignmentById(id, token);
            setData(res);
            setLoading(false);
            setAlreadySubmitted(res.alreadySubmitted);
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
            <div className="flex justify-center items-center h-64 text-slate-500 font-bold font-sans">
                Loading assignment…
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center mt-10 rounded-3xl p-10 bg-slate-200 border border-slate-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),0_5px_10px_rgba(0,0,0,0.05)] mx-6 text-slate-500 font-bold font-sans">
                Assignment not found
            </div>
        );
    }

    const { assignment, isDeadlinePassed } = data;

    const urgencyColor =
        !remaining
            ? "border-red-400 bg-red-100/50 shadow-inner text-red-800"
            : remaining.total < 1000 * 60 * 60 * 24
                ? "border-amber-400 bg-amber-100/50 shadow-inner text-amber-800"
                : "border-green-400 bg-green-100/50 shadow-inner text-green-800";

    return (
        <div className="text-slate-800 font-sans pb-16 bg-[#eef2f6]">
            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* HEADER */}
                <div className="mb-10 p-8 rounded-3xl bg-slate-200 border-t border-l border-white shadow-[8px_12px_20px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)]">
                    <h1 className="text-4xl font-extrabold drop-shadow-sm mb-4 text-slate-800">
                        {assignment.title}
                    </h1>

                    <div className="flex flex-wrap gap-3 text-xs font-bold font-mono uppercase tracking-tight text-slate-600">
                        <span className="px-3 py-1.5 bg-slate-300/50 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)]">📘 {assignment.subject}</span>
                        <span className="px-3 py-1.5 bg-slate-300/50 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)]">🎓 {assignment.course}</span>
                        <span className="px-3 py-1.5 bg-slate-300/50 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)]">📚 Semester {assignment.semester}</span>
                        <span className="px-3 py-1.5 bg-slate-300/50 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)]">
                            🧑‍🏫 {assignment.teacherId?.name}
                        </span>
                    </div>
                </div>

                {/* DEADLINE CARD */}
                <div
                    className={`mb-12 p-8 rounded-3xl border-2 ${urgencyColor} shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)]`}
                >
                    <p className="text-xs uppercase font-extrabold tracking-widest opacity-80 mb-4">
                        Submission Deadline
                    </p>

                    <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
                        <div className="flex flex-wrap items-center gap-6">
                            <span className="text-2xl font-extrabold drop-shadow-sm">
                                {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : 'N/A'}
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
                                            className="px-3 py-2 rounded-xl bg-white/40 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] border border-white/50 text-center min-w-16"
                                        >
                                            <p className="text-2xl font-black drop-shadow-sm leading-none">
                                                {item.value}
                                            </p>
                                            <p className="text-[10px] font-extrabold uppercase mt-1 opacity-70">
                                                {item.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <span className="font-extrabold uppercase text-lg opacity-80 tracking-widest">
                                    Deadline Passed
                                </span>
                            )}
                        </div>

                        {/* ACTION */}
                        <div className="mt-4 md:mt-0 shrink-0">
                            {user.role === "faculty" || user.role === "admin" ? (
                                <button
                                    onClick={() => navigate(`/submissions/${assignment._id}`)}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 text-white font-extrabold tracking-wide shadow-[0_5px_10px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-[3px] border-blue-800 active:border-b-0 active:translate-y-[3px] transition-all w-full md:w-auto"
                                >
                                    See Submissions
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowSubmissionModal(true)}
                                    disabled={isDeadlinePassed || alreadySubmitted}
                                    className={`px-8 py-4 rounded-xl font-extrabold tracking-wide text-lg w-full md:w-auto transition-all ${isDeadlinePassed || alreadySubmitted
                                        ? "bg-slate-300 text-slate-500 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,1)] border border-slate-400 cursor-not-allowed"
                                        : "bg-gradient-to-b from-emerald-500 to-emerald-700 text-white shadow-[0_5px_10px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-[3px] border-emerald-800 active:border-b-0 active:translate-y-[3px]"
                                        }`}
                                >
                                    {alreadySubmitted
                                        ? "✓ Already Submitted"
                                        : isDeadlinePassed
                                            ? "Deadline Passed"
                                            : "Submit Assignment"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="p-8 rounded-3xl bg-slate-300/60 shadow-[inset_3px_5px_10px_rgba(0,0,0,0.15),0_2px_0_rgba(255,255,255,0.8)] border border-slate-400">
                    <p className="uppercase text-xs font-extrabold tracking-widest text-slate-500 mb-4">Instructions</p>
                    <div
                        className="prose prose-slate max-w-none prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h2:font-bold prose-p:font-medium prose-p:leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: assignment.description,
                        }}
                    />
                </div>

                {/* FILE */}
                {assignment.fileUrl && (
                    <div className="mt-8 flex justify-center">
                        <a
                            href={assignment.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-200 border-t border-l border-white border-b-slate-400 border-r-slate-400 shadow-[4px_6px_10px_rgba(0,0,0,0.1),inset_1px_1px_2px_rgba(255,255,255,0.8)] hover:-translate-y-0.5 hover:shadow-[6px_8px_12px_rgba(0,0,0,0.15)] active:translate-y-[2px] active:shadow-none transition-all font-extrabold text-blue-700"
                        >
                            📎 View Attached Reference File
                        </a>
                    </div>
                )}
            </div>

            {showSubmissionModal && (
                <SubmissionModal
                    onClose={() => setShowSubmissionModal(false)}
                    assignmentId={assignment._id}
                />
            )}
        </div>
    );
};

export default AssignmentDetails;
