import { motion } from "framer-motion";
import { FiUsers, FiBookOpen, FiCheckCircle, FiBell, FiMenu, FiSettings } from "react-icons/fi";
import { useContext, useEffect } from "react";
import AuthContext from "../contexts/AuthContext/AuthContext";
import AdminDashboardContext from "../contexts/AdminDashboardContext/AdminDashboardContext";

const colorClass = {
    amber: "text-amber-500",
    emerald: "text-emerald-500",
    cyan: "text-blue-500",
    indigo: "text-indigo-500",
};

export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const { dashboardData, loading, getAdminDashboardData } = useContext(AdminDashboardContext);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            getAdminDashboardData(token);
        }
        // eslint-disable-next-line
    }, []);

    const dynamicStats = [
        { label: "Total Users", value: dashboardData?.totalUsers || 0, icon: <FiUsers />, color: "amber" },
        { label: "Active Assignments", value: dashboardData?.activeAssignments || 0, icon: <FiBookOpen />, color: "emerald" },
        { label: "Total Submissions", value: dashboardData?.totalSubmissions || 0, icon: <FiBookOpen />, color: "emerald" },
        { label: "Pending Approvals", value: dashboardData?.pendingApprovals || 0, icon: <FiCheckCircle />, color: "cyan" },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 font-sans text-slate-500 font-bold animate-pulse text-xl">
                Loading administrative metrics...
            </div>
        );
    }

    return (
        <div className="space-y-10 font-sans">
            {/* HEADER */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 drop-shadow-sm flex items-center gap-2">
                        Welcome back, {user?.name?.split(" ")[0] || "Admin"}
                    </h1>
                    <p className="text-sm font-bold text-slate-500 mt-1">Your admin dashboard is ready.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="relative p-3 rounded-xl bg-slate-200 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] border border-t-slate-400 border-l-slate-400 border-b-white border-r-white text-slate-700 hover:bg-slate-300 transition-colors cursor-pointer outline-none active:scale-95">
                        <FiBell className="text-xl" />
                        {dashboardData?.pendingApprovals > 0 && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_1px_2px_rgba(255,255,255,0.8)] border border-red-700" />
                        )}
                    </button>
                    <button className="md:hidden relative p-3 rounded-xl bg-slate-200 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] border border-t-slate-400 border-l-slate-400 border-b-white border-r-white text-slate-700 hover:bg-slate-300 transition-colors cursor-pointer outline-none active:scale-95">
                        <FiMenu className="text-xl" />
                    </button>
                </div>
            </header>

            {/* STATS */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {dynamicStats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-2xl p-6 bg-slate-200 border-t border-l border-white shadow-[8px_12px_20px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)] hover:-translate-y-1 hover:shadow-[12px_16px_25px_rgba(0,0,0,0.15)] transition-all duration-300"
                    >
                        <div className={`${colorClass[s.color]} text-3xl mb-4 drop-shadow-sm`}>
                            {s.icon}
                        </div>
                        <p className="text-sm font-bold text-slate-500 tracking-wide uppercase">{s.label}</p>
                        <p className="text-3xl font-extrabold text-slate-800 drop-shadow-sm mt-1">{s.value}</p>
                    </motion.div>
                ))}
            </section>

            {/* FOCUS + QUICK ACTIONS */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 rounded-3xl p-8 bg-slate-200 shadow-[8px_12px_20px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)] border border-slate-400 group overflow-hidden relative flex flex-col justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 pointer-events-none" />
                    <p className="uppercase font-bold text-xs tracking-widest text-slate-500">System Overview</p>
                    <h2 className="text-3xl font-extrabold text-slate-800 drop-shadow-sm mt-3">Pending User Approvals</h2>
                    
                    {dashboardData?.pendingApprovals > 0 ? (
                        <p className="text-slate-600 font-medium mt-2 flex items-center gap-2 relative z-10">
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)] drop-shadow-sm text-sm font-bold">
                                {dashboardData.pendingApprovals} Pending
                            </span>
                            <span>•</span>
                            <span className="font-bold text-slate-700">Review required</span>
                        </p>
                    ) : (
                        <p className="text-slate-600 font-medium mt-2 flex items-center gap-2 relative z-10">
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)] drop-shadow-sm text-sm font-bold">
                                0 Pending
                            </span>
                            <span>•</span>
                            <span className="font-bold text-slate-700">All caught up</span>
                        </p>
                    )}
                </div>

                <div className="rounded-3xl p-6 space-y-4 bg-slate-200 border-t border-l border-white shadow-[8px_12px_20px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)]">
                    <h3 className="font-extrabold text-lg text-slate-800 drop-shadow-sm mb-4">Quick Actions</h3>
                    {["Manage Users", "View Approval"].map((a, i) => (
                        <button
                            key={i}
                            className="w-full text-left px-5 py-4 rounded-xl bg-gradient-to-b from-slate-100 to-slate-200 text-slate-700 font-bold shadow-[0_3px_5px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.9)] border-b-[3px] border-slate-300 hover:text-slate-900 active:border-b-0 active:translate-y-[2px] transition-all flex items-center justify-between group"
                        >
                            {a}
                            <FiSettings className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
