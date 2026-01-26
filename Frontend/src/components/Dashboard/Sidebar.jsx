import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthContext from "../../contexts/AuthContext/AuthContext";
import logo from "../../assets/logo.png"; // adjust path
import { DASHBOARD_CONFIG } from "./dashboardConfig";

const Sidebar = ({ sidebarOpen }) => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    if (loading) return null;
    if (!user) return null;

    const roleConfig = DASHBOARD_CONFIG[user.role];
    if (!roleConfig) return null;

    return (
        <aside
            className={`fixed md:static z-50 inset-y-0 left-0 w-72 flex flex-col
        bg-white/5 backdrop-blur-xl border-r border-white/10
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
        >
            {/* LOGO */}
            <div className="flex items-center gap-3 px-6 py-6">
                <img src={logo} alt="Campus Connect" className="w-10 h-10 rounded-md" />
                <div>
                    <h1 onClick={e => navigate("/")} className="font-bold tracking-wide">Campus Connect</h1>
                    <p className="text-xs text-slate-400">Study Mode</p>
                </div>
            </div>

            <hr className="mb-4 w-[90%] mx-auto border-white/10" />

            {/* NAV */}
            <nav className="flex-1 px-4 space-y-2 text-sm">
                {roleConfig.nav.map((item, i) => (
                    <NavLink key={i} to={item.path} end>
                        {({ isActive }) => (
                            <motion.div
                                whileHover={{ x: 6 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors duration-200
                                    ${isActive
                                        ? "bg-linear-to-r from-indigo-500/30 to-cyan-500/30 text-white"
                                        : "text-slate-400 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                <span className="text-lg"><item.icon /></span>
                                <span className="font-medium">{item.label}</span>
                            </motion.div>
                        )}
                    </NavLink>
                ))}
            </nav>


            {/* USER */}
            <div className="px-4 py-4 border-t border-white/10">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10">
                    <img
                        src={user?.profileImage || "/avatar.png"}
                        alt="User"
                        className="w-10 h-10 rounded-full bg-white"
                    />
                    <div>
                        <p className="text-sm font-semibold">{user?.name || "Student"}</p>
                        <p className="text-xs text-slate-400 capitalize">
                            {user?.role || "student"}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
