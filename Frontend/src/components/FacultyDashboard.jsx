import { motion } from "framer-motion";
import {
    FiBookOpen,
    FiCheckCircle,
    FiClock,
    FiTrendingUp,
    FiBell,
    FiMenu,
} from "react-icons/fi";
import { useContext } from "react";
import { useOutletContext } from "react-router-dom";
import AuthContext from "../contexts/AuthContext/AuthContext";

const stats = [
    { label: "Classes Today", value: 4, icon: <FiClock />, color: "amber" },
    { label: "Assignments Graded", value: 12, icon: <FiCheckCircle />, color: "emerald" },
    { label: "Resources Uploaded", value: 28, icon: <FiBookOpen />, color: "cyan" },
    { label: "Streak", value: "7 Days", icon: <FiTrendingUp />, color: "indigo" },
];

const colorClass = {
    amber: "text-amber-500 dark:text-amber-400",
    emerald: "text-emerald-500 dark:text-emerald-400",
    cyan: "text-cyan-500 dark:text-cyan-400",
    indigo: "text-indigo-500 dark:text-indigo-400",
};

export default function FacultyDashboard() {
    const { user } = useContext(AuthContext);

    return (
        <div className="space-y-10">
            {/* HEADER */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">
                        Welcome back, {user?.name?.split(" ")[0] || "Faculty"}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Your teaching dashboard is ready.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* NOTIFICATIONS */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative p-3 rounded-xl
              bg-slate-100 dark:bg-white/5
              border border-slate-200 dark:border-white/10
              text-slate-700 dark:text-white"
                    >
                        <FiBell />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                    </motion.div>
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
                        className="rounded-2xl p-5
              bg-white dark:bg-white/5
              border border-slate-200 dark:border-white/10"
                    >
                        <div className={`${colorClass[s.color]} text-2xl mb-3`}>
                            {s.icon}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {s.label}
                        </p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                            {s.value}
                        </p>
                    </motion.div>
                ))}
            </section>

            {/* FOCUS + QUICK ACTIONS */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CURRENT CLASS */}
                <div
                    className="lg:col-span-2 rounded-3xl p-8
            bg-linear-to-br
            from-indigo-500/20 to-cyan-500/10
            border border-slate-200 dark:border-white/10"
                >
                    <p className="uppercase text-xs tracking-widest text-slate-500 dark:text-slate-400">
                        Current Class
                    </p>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-3">
                        Database Systems Lecture
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Room 301 • 10:00 AM - 11:30 AM
                    </p>
                </div>

                {/* QUICK ACTIONS */}
                <div
                    className="rounded-3xl p-6 space-y-4
            bg-white dark:bg-white/5
            border border-slate-200 dark:border-white/10"
                >
                    <h3 className="font-semibold text-slate-800 dark:text-white">
                        Quick Actions
                    </h3>

                    {["Upload Grades", "Create Resource", "Schedule Class"].map((a, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ x: 6 }}
                            className="p-4 rounded-xl cursor-pointer
                bg-slate-100 dark:bg-white/5
                hover:bg-slate-200 dark:hover:bg-white/10
                text-slate-700 dark:text-slate-200"
                        >
                            {a}
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
