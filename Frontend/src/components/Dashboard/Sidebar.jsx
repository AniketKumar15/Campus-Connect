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
        bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-white/10
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
        >
            {/* LOGO */}
            <div className="flex items-center gap-3 px-6 py-6">
                <img src={logo} alt="Campus Connect" className="w-10 h-10 rounded-md" />
                <div>
                    <h1
                        onClick={() => navigate("/")}
                        className="font-bold tracking-wide cursor-pointer text-slate-800 dark:text-white"
                    >
                        Campus Connect
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Study Mode
                    </p>
                </div>
            </div>

            <hr className="mb-4 w-[90%] mx-auto border-slate-200 dark:border-white/10" />
            {/* MOBILE MENU */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden ml-2 absolute top-2 left-70 p-3 rounded-xl
              text-slate-700 dark:text-white"
            >
                {!sidebarOpen ? <IoIosArrowForward size={24} /> : <IoIosArrowBack size={24} />}
            </motion.button>

            {/* NAV */}
            <nav className="flex-1 px-4 space-y-2 text-sm">
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
                    cursor-pointer
                    text-slate-600 dark:text-slate-400
                    hover:text-slate-900 dark:hover:text-white
                    hover:bg-slate-100 dark:hover:bg-white/10"
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
                                    className="overflow-hidden ml-6 space-y-1"
                                >
                                    {item.children.map((child, idx) => (
                                        <NavLink key={idx} to={child.path} end>
                                            {({ isActive }) => (
                                                <div
                                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm
                            ${isActive
                                                            ? "bg-indigo-500/20 text-indigo-600 dark:text-white"
                                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                                                        }`}
                                                >
                                                    <span className="text-base">
                                                        <child.icon />
                                                    </span>
                                                    {child.label}
                                                </div>
                                            )}
                                        </NavLink>
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
                                    whileHover={{ x: 6 }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                    ${isActive
                                            ? "bg-indigo-500/20 text-indigo-600 dark:text-white"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                >
                                    <span className="text-lg">
                                        <item.icon />
                                    </span>
                                    <span className="font-medium">{item.label}</span>
                                </motion.div>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* USER */}
            <div className="px-4 py-4 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10">
                    <img
                        src={user?.profileImage || "/avatar.png"}
                        alt="User"
                        className="w-10 h-10 rounded-full bg-white"
                    />
                    <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">
                            {user?.name || "Student"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                            {user?.role || "student"}
                        </p>
                    </div>
                </div>

                {/* THEME TOGGLE */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
                >
                    {isDark ? (
                        <MdOutlineWbSunny className="text-yellow-400 text-xl" />
                    ) : (
                        <IoMoonOutline className="text-slate-700 text-xl" />
                    )}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
