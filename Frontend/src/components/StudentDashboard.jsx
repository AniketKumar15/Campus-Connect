import { motion } from "framer-motion";
import { FiBookOpen, FiCheckCircle, FiClock, FiTrendingUp, FiBell, FiMenu } from "react-icons/fi";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext/AuthContext";
import { useOutletContext } from "react-router-dom";


const stats = [
    { label: "Pending", value: 3, icon: <FiClock />, color: "amber" },
    { label: "Completed", value: 12, icon: <FiCheckCircle />, color: "emerald" },
    { label: "Resources", value: 28, icon: <FiBookOpen />, color: "cyan" },
    { label: "Streak", value: "5 Days", icon: <FiTrendingUp />, color: "indigo" },
];

const colorClass = {
    amber: "text-amber-400",
    emerald: "text-emerald-400",
    cyan: "text-cyan-400",
    indigo: "text-indigo-400",
};

export default function StudentDashboard() {
    const { user } = useContext(AuthContext);
    const { sidebarOpen, setSidebarOpen } = useOutletContext();

    return (
        <div className="space-y-10">
            {/* HEADER */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold">
                        Welcome back, {user?.name?.split(" ")[0] || "Student"}
                    </h1>
                    <p className="text-slate-400 mt-1">Your learning dashboard is ready.</p>
                </div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative p-3 rounded-xl bg-white/5 border border-white/10"
                >
                    <FiBell />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden ml-2 relative p-3 rounded-xl bg-white/5 border border-white/10"
                >
                    <FiMenu />
                </motion.div>
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
                        <div className={`${colorClass[s.color]} text-2xl mb-3`}>
                            {s.icon}
                        </div>
                        <p className="text-sm text-slate-400">{s.label}</p>
                        <p className="text-2xl font-bold mt-1">{s.value}</p>
                    </motion.div>
                ))}
            </section>

            {/* FOCUS + QUICK ACTIONS */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 rounded-3xl p-8 bg-linear-to-br from-indigo-500/20 to-cyan-500/10 border border-white/10">
                    <p className="uppercase text-xs tracking-widest text-slate-400">Focus Task</p>
                    <h2 className="text-2xl font-bold mt-3">ER Diagram Submission</h2>
                    <p className="text-slate-400">DBMS • Due in 2 days</p>
                </div>

                <div className="rounded-3xl p-6 bg-white/5 border border-white/10 space-y-4">
                    <h3 className="font-semibold">Quick Actions</h3>
                    {["Submit Assignment", "Upload Resource"].map((a, i) => (
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
