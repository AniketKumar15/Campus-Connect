import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdOutlineWbSunny } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";

import AuthContext from "../../contexts/AuthContext/AuthContext";
import ThemeContext from "../../contexts/ThemeContext";
import { DASHBOARD_CONFIG } from "./dashboardConfig";
import logo from "../../assets/logo.png";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const { user, loading } = useContext(AuthContext);
    const { isDark, toggleTheme } = useContext(ThemeContext);
    const [openMenu, setOpenMenu] = useState(null);
    const navigate = useNavigate();

    if (loading || !user) return null;

    const roleConfig = DASHBOARD_CONFIG[user.role];
    if (!roleConfig) return null;

    return (
        <aside
            className={`fixed md:static z-50 inset-y-0 left-0 w-72 flex flex-col
        bg-slate-200 border-r-2 border-white shadow-[8px_0_20px_rgba(0,0,0,0.1),inset_-2px_0_6px_rgba(0,0,0,0.05)]
        transform transition-transform duration-300 font-sans
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
        >
            {/* LOGO */}
            <div className="flex items-center gap-4 px-6 py-8">
                <div className="p-1.5 rounded-xl bg-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_2px_4px_rgba(255,255,255,0.8)] border-b-2 border-r-2 border-white">
                    <img src={logo} alt="Campus Connect" className="w-10 h-10 object-contain" />
                </div>
                <div>
                    <h1
                        onClick={() => navigate("/")}
                        className="font-extrabold text-lg tracking-wide cursor-pointer text-slate-800 drop-shadow-sm leading-tight"
                    >
                        Campus Connect
                    </h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                        {roleConfig.label}
                    </p>
                </div>
            </div>

            <div className="h-[3px] w-[85%] mx-auto bg-slate-300 rounded shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.9)] mb-6" />

            {/* MOBILE MENU */}
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden ml-2 absolute top-6 left-[290px] p-2 rounded-xl
              bg-slate-200 shadow-[2px_2px_6px_rgba(0,0,0,0.15),inset_2px_2px_4px_rgba(255,255,255,0.8)] border border-white text-slate-700 font-bold"
            >
                {!sidebarOpen ? <IoIosArrowForward size={24} /> : <IoIosArrowBack size={24} />}
            </motion.button>

            {/* NAV */}
            <nav className="flex-1 px-5 space-y-2 text-sm overflow-y-auto">
                {roleConfig.nav.map((item, i) => {
                    /* EXPANDABLE MENU */
                    if (item.children) {
                        const isOpen = openMenu === item.label;

                        return (
                            <div key={i}>
                                <div
                                    onClick={() =>
                                        setOpenMenu(isOpen ? null : item.label)
                                    }
                                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl
                    cursor-pointer font-bold
                    text-slate-600 transition-all
                    hover:text-slate-800 hover:bg-slate-300 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">
                                            <item.icon />
                                        </span>
                                        <span className="font-medium">{item.label}</span>
                                    </div>

                                    <motion.span
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FiChevronDown />
                                    </motion.span>
                                </div>

                                {/* CHILD LINKS */}
                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: isOpen ? "auto" : 0,
                                        opacity: isOpen ? 1 : 0,
                                    }}
                                    className="overflow-hidden ml-6 space-y-2 mt-2 border-l-[3px] border-slate-300 shadow-[inset_2px_0_2px_rgba(0,0,0,0.05)] rounded-l"
                                >
                                    {item.children.map((child, idx) => (
                                        <div className="pl-3 py-1" key={idx}>
                                            <NavLink to={child.path} end>
                                                {({ isActive }) => (
                                                    <div
                                                        className={`flex items-center gap-3 px-4 py-2 rounded-lg font-bold transition-all
                                ${isActive
                                                                ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                                                                : "text-slate-600 hover:bg-slate-300 hover:text-slate-800 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                                                            }`}
                                                    >
                                                        <span className="text-base">
                                                            <child.icon />
                                                        </span>
                                                        {child.label}
                                                    </div>
                                                )}
                                            </NavLink>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        );
                    }

                    /* NORMAL MENU ITEM */
                    return (
                        <NavLink key={i} to={item.path} end>
                            {({ isActive }) => (
                                <motion.div
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer font-bold transition-all mb-2
                    ${isActive
                                            ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                                            : "text-slate-600 hover:bg-slate-300 hover:text-slate-800 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                                        }`}
                                >
                                    <span className="text-lg">
                                        <item.icon />
                                    </span>
                                    <span>{item.label}</span>
                                </motion.div>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* USER & THEME CONTROL */}
            <div className="px-5 py-5 bg-slate-200 border-t border-slate-300 shadow-[0_-2px_6px_rgba(0,0,0,0.05),inset_0_2px_2px_rgba(255,255,255,0.8)]">
                <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3 p-2 rounded-xl flex-1 bg-slate-100 border border-t-slate-400 border-l-slate-400 border-b-white border-r-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] overflow-hidden">
                        <img
                            src={user?.profileImage || "/avatar.png"}
                            alt="User"
                            className="w-10 h-10 shrink-0 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.2)] bg-slate-300"
                        />
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-800 truncate leading-snug">
                                {user?.name || "Student"}
                            </p>
                            <p className="text-[10px] uppercase tracking-wider font-extrabold text-blue-700 truncate mt-0.5">
                                {user?.role || "student"}
                            </p>
                        </div>
                    </div>

                    {/* THEME TOGGLE BUTTON */}
                    <button
                        onClick={toggleTheme}
                        className="p-3 shrink-0 rounded-xl bg-gradient-to-b from-slate-100 to-slate-300 text-slate-700 shadow-[0_3px_6px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.8)] border-b-2 border-slate-400 active:border-b-0 active:translate-y-[2px] transition-all flex items-center justify-center"
                    >
                        {isDark ? (
                            <MdOutlineWbSunny className="text-yellow-600 text-xl" />
                        ) : (
                            <IoMoonOutline className="text-slate-700 text-xl" />
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
