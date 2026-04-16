import { useEffect, useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext/AuthContext";
import ThemeContext from "../contexts/ThemeContext";
import {
    FiMenu,
    FiX,
    FiHome,
    FiUsers,
    FiCalendar,
    FiLogIn,
    FiClipboard
} from "react-icons/fi";
import { GoDiscussionClosed } from "react-icons/go";
import { MdOutlineWbSunny } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import logo from "../assets/Logo1.png";

const links = [
    { name: "Home", icon: FiHome, to: "/" },
    { name: "Campus Insights", icon: FiUsers, to: "/campus-insights" },
    { name: "Resources", icon: FiClipboard, to: "/resources" },
];

const Nav = () => {
    const { user, logout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState("Home");
    const [moreOpen, setMoreOpen] = useState(false);
    const { isDark, toggleTheme } = useContext(ThemeContext);


    const linkClasses = (name) =>
        `relative flex items-center gap-2 transition
   ${active === name
            ? "text-slate-900 dark:text-white"
            : "text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white"
        }`;


    return (
        <nav className="fixed top-0 z-50 w-full pt-4 font-sans">
            <div className="mx-auto max-w-7xl px-4">
                <div className="rounded-2xl bg-slate-200 border-t border-l border-white p-1 shadow-[8px_12px_20px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)]">
                    {/* Main Bar */}
                    <div className="flex h-16 items-center justify-between px-6">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="p-1 rounded-xl bg-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_2px_4px_rgba(255,255,255,0.8)] border-b-2 border-r-2 border-white">
                                <img
                                    src={logo}
                                    alt="Campus Connect"
                                    className="h-8 w-8 object-contain scale-180"
                                />
                            </div>
                            <span className="text-lg font-extrabold text-slate-800 drop-shadow-sm">
                                Campus
                                <span className="ml-1 text-blue-700">Connect</span>
                            </span>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-10 text-sm font-bold relative">
                            {links.slice(0, 3).map(({ name, icon: Icon, to }) => (
                                <Link
                                    to={to}
                                    key={name}
                                    onClick={() => setActive(name)}
                                    className={linkClasses(name)}
                                    data-cursor="hover"
                                >
                                    <Icon />
                                    {name}
                                    {/* Active state indicator */}
                                    {active === name && (
                                        <span className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full bg-blue-600 shadow-[0_2px_4px_rgba(0,89,187,0.4),inset_0_1px_1px_rgba(255,255,255,0.5)]" />
                                    )}
                                </Link>
                            ))}
                            {/* MORE DROPDOWN */}
                            {/* <div
                                className="relative"
                                onClick={() => setMoreOpen(!moreOpen)}
                            >
                                <button
                                    className={`flex items-center gap-2 transition 
                                         ${active === "More"
                                            ? "text-slate-800"
                                            : "text-slate-600 hover:text-slate-800"
                                        }`}
                                >
                                    More
                                    <IoIosArrowDown className={`w-4 h-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                                </button>

                                {moreOpen && (
                                    <div className="absolute top-full mt-7 w-50 rounded-xl bg-slate-200 border-t border-l border-white shadow-[8px_12px_20px_rgba(0,0,0,0.15),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.8)] p-2">
                                        {links.slice(3).map(({ name, icon: Icon, to }) => (
                                            <Link
                                                to={to}
                                                key={name}
                                                onClick={() => setActive(name)}
                                                className={`relative flex items-center gap-2 font-bold px-4 py-2 text-sm text-slate-700 hover:bg-slate-300 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] rounded-lg transition ${active === name ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" : ""}`}
                                            >
                                                <Icon />
                                                {name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div> */}
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            {!user ?
                                (<Link to="/auth" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition">
                                    <FiLogIn /> Login
                                </Link>
                                ) :
                                (<>
                                    <button onClick={logout} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition">
                                        <FiLogIn /> Logout
                                    </button>
                                    <Link to="/dashboard" className="rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 px-5 py-2 text-sm font-bold text-white shadow-[0_5px_10px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-[3px] border-blue-800 active:border-b-0 active:translate-y-[2px] transition-all">
                                        Dashboard
                                    </Link>

                                </>)
                            }
                            <button onClick={toggleTheme} className="p-2 rounded-xl bg-gradient-to-b from-slate-100 to-slate-300 text-slate-700 shadow-[0_3px_6px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.8)] border-b-2 border-slate-400 active:border-b-0 active:translate-y-[2px] transition-all flex items-center justify-center">
                                {isDark ? (
                                    <MdOutlineWbSunny className="text-yellow-600 text-lg" />
                                ) : (
                                    <IoMoonOutline className="text-lg text-slate-700" />
                                )}
                            </button>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="md:hidden p-2 rounded-xl bg-gradient-to-b from-slate-100 to-slate-300 text-slate-700 shadow-[0_3px_6px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.8)] border-b-2 border-slate-400 active:border-b-0 active:translate-y-[2px] transition-all flex items-center justify-center text-xl font-bold"
                        >
                            {open ? <FiX /> : <FiMenu />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {open && (
                        <div className="md:hidden border-t border-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] px-6 py-4 space-y-4 rounded-b-2xl bg-slate-200">
                            {links.map(({ name, icon: Icon, to }) => (
                                <Link
                                    to={to}
                                    key={name}
                                    onClick={() => {
                                        setActive(name);
                                        setOpen(false);
                                    }}
                                    className={`flex items-center gap-3 w-full text-left transition font-bold px-4 py-2 rounded-xl
                                        ${active === name
                                            ? "text-white bg-gradient-to-br from-blue-500 to-blue-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                                            : "text-slate-600 hover:text-slate-800 hover:bg-slate-300 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                                        }`}
                                >
                                    <Icon />
                                    {name}
                                </Link>
                            ))}

                            <div className="pt-4 border-t border-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] space-y-4">
                                {!user ?
                                    (<Link to="/auth" className="flex items-center gap-2 font-bold px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-300 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] rounded-xl transition">
                                        <FiLogIn /> Login
                                    </Link>) :
                                    (<>
                                        <button onClick={logout} className="flex items-center gap-2 font-bold px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-300 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] rounded-xl transition">
                                            <FiLogIn /> Logout
                                        </button>
                                        <Link to="/dashboard" className="w-full flex items-center justify-center text-center rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 px-4 py-3 font-bold text-white shadow-[0_5px_10px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-[3px] border-blue-800 active:border-b-0 active:translate-y-[2px] transition-all">
                                            Dashboard
                                        </Link>
                                    </>)
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Nav;
