import { motion } from "framer-motion";
import { FiUsers, FiBookOpen, FiCheckCircle, FiClock, FiBell, FiMenu } from "react-icons/fi";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext/AuthContext";
import { useOutletContext } from "react-router-dom";

const stats = [
    { label: "Total Users", value: 128, icon: <FiUsers />, color: "amber" },
    { label: "Active Courses", value: 24, icon: <FiBookOpen />, color: "emerald" },
    { label: "Pending Approvals", value: 7, icon: <FiCheckCircle />, color: "cyan" },
    { label: "System Uptime", value: "99.9%", icon: <FiClock />, color: "indigo" },
];

const colorClass = {
    amber: "text-amber-400",
    emerald: "text-emerald-400",
    cyan: "text-cyan-400",
    indigo: "text-indigo-400",
};

export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const { sidebarOpen, setSidebarOpen } = useOutletContext();

    return (
        <div className="space-y-10">
            {/* HEADER */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold">
                        Welcome back, {user?.name?.split(" ")[0] || "Admin"}
                    </h1>
                    <p className="text-slate-400 mt-1">Your admin dashboard is ready.</p>
                </div>

                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                        <FiBell />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                    </motion.div>

                    {/* MOBILE MENU BUTTON */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="md:hidden ml-2 relative p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                        <FiMenu />
                    </motion.button>
                </div>
            </header>

            {/* STATS */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-2xl p-5 bg-white/5 border border-white/10"
                    >
                        <div className={`${colorClass[s.color]} text-2xl mb-3`}>{s.icon}</div>
                        <p className="text-sm text-slate-400">{s.label}</p>
                        <p className="text-2xl font-bold mt-1">{s.value}</p>
                    </motion.div>
                ))}
            </section>

            {/* FOCUS + QUICK ACTIONS */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 rounded-3xl p-8 bg-linear-to-br from-indigo-500/20 to-cyan-500/10 border border-white/10">
                    <p className="uppercase text-xs tracking-widest text-slate-400">System Overview</p>
                    <h2 className="text-2xl font-bold mt-3">Pending User Approvals</h2>
                    <p className="text-slate-400">There are 7 pending registrations to review.</p>
                </div>

                <div className="rounded-3xl p-6 bg-white/5 border border-white/10 space-y-4">
                    <h3 className="font-semibold">Quick Actions</h3>
                    {["Manage Users", "View Reports", "Add Course"].map((a, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ x: 6 }}
                            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer"
                        >
                            {a}
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
