import { useContext, useEffect, useMemo, useState } from "react";
import AssignmentContext from "../../../contexts/AssignmentContext/AssignmentContext";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiChevronDown } from "react-icons/fi";

const StudentAllAssigment = () => {
    const {
        assignments,
        loading,
        getAssignmentsForStudent,
    } = useContext(AssignmentContext);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        getAssignmentsForStudent(token);
    }, []);

    /* ---------- Date Helpers ---------- */
    const normalizeDate = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const getStatus = (deadline) => {
        if (!deadline) return "Active";

        const today = normalizeDate(new Date());
        const due = normalizeDate(deadline);

        return due < today ? "Expired" : "Active";
    };

    const isDueToday = (deadline) => {
        if (!deadline) return false;

        const today = normalizeDate(new Date());
        const due = normalizeDate(deadline);

        return today.getTime() === due.getTime();
    };

    const isDueThisWeek = (deadline) => {
        if (!deadline) return false;

        const today = normalizeDate(new Date());
        const due = normalizeDate(deadline);

        const diffDays =
            (due.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24);

        return diffDays >= 0 && diffDays <= 7;
    };

    /* ---------- Filtering ---------- */
    const filteredAssignments = useMemo(() => {
        return assignments?.filter((a) => {
            const title = (a.title || "").toLowerCase();
            const subject = (a.subject || "").toLowerCase();
            const searchText = search.toLowerCase();

            const matchesSearch =
                title.includes(searchText) ||
                subject.includes(searchText);

            if (!matchesSearch) return false;

            switch (filter) {
                case "active":
                    return getStatus(a.deadline) === "Active";
                case "expired":
                    return getStatus(a.deadline) === "Expired";
                case "today":
                    return isDueToday(a.deadline);
                case "week":
                    return isDueThisWeek(a.deadline);
                default:
                    return true;
            }
        });
    }, [assignments, search, filter]);

    /* ---------- Loading ---------- */
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-slate-500 font-bold font-sans">
                Loading assignments...
            </div>
        );
    }

    if (!assignments || assignments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center mt-10 rounded-3xl p-10 bg-slate-200 border border-slate-300 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),0_5px_10px_rgba(0,0,0,0.05)] mx-6 text-slate-500 font-bold font-sans">
                You don’t have any assignments
            </div>
        );
    }

    /* ---------- UI ---------- */
    return (
        <div className="max-w-7xl mx-auto px-6 py-8 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <h1 className="text-3xl font-extrabold text-slate-800 drop-shadow-sm">
                    Assignments
                </h1>

                <div className="flex gap-4 flex-wrap">
                    {/* Search */}
                    <div className="relative">
                        <FiSearch className="absolute top-3.5 left-3 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search assignments..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-3 rounded-xl bg-slate-100 border border-t-slate-400 border-l-slate-400 border-b-white border-r-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 font-bold w-full md:w-64"
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="appearance-none pr-10 pl-4 py-3 rounded-xl bg-slate-100 border border-t-slate-400 border-l-slate-400 border-b-white border-r-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 font-bold cursor-pointer"
                        >
                            <option value="all">All Assignments</option>
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                            <option value="today">Due Today</option>
                            <option value="week">Due This Week</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-3.5 text-slate-500 pointer-events-none text-xl" />
                    </div>
                </div>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssignments?.map((assignment) => {
                    const status = getStatus(assignment.deadline);

                    return (
                        <div
                            key={assignment._id}
                            className="rounded-2xl p-6 bg-slate-200 border-t border-l border-white shadow-[8px_12px_20px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)] hover:-translate-y-1 hover:shadow-[12px_16px_25px_rgba(0,0,0,0.15)] transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                            onClick={() =>
                                navigate(`/assignments/${assignment._id}`)
                            }
                        >
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="font-extrabold text-lg text-slate-800 drop-shadow-sm leading-snug pr-2 group-hover:text-blue-700 transition-colors">
                                        {assignment.title}
                                    </h2>
                                    <span
                                        className={`shrink-0 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)] border border-white/20
                                        ${status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {status}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold font-mono">
                                <span className="px-2 py-1 bg-slate-300/50 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)] text-slate-700">
                                    📘 {assignment.subject}
                                </span>
                                <span className="px-2 py-1 bg-slate-300/50 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)] text-slate-700">
                                    🎓 {assignment.course}
                                </span>
                            </div>

                            <div className="mt-4 pt-4 border-t-2 border-slate-300 font-bold text-sm text-slate-600 flex items-center justify-between">
                                <span>📅 Due {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentAllAssigment;
