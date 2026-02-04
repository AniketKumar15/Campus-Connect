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
import logo from "../assets/Logo.png";

const links = [
    { name: "Home", icon: FiHome, to: "/" },
    { name: "Events", icon: FiCalendar, to: "#events" },
    { name: "Campus Insights", icon: FiUsers, to: "#network" },
    { name: "Discussion Chamber", icon: GoDiscussionClosed, to: "#discussion-Chamber" },
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
        <nav className="fixed top-0 z-50 w-full">
            <div className="mx-auto max-w-7xl px-4">
                <div className="mt-4 rounded-2xl bg-[#ECECEC] dark:bg-black/70 backdrop-blur-xl  border border-indigo-400 shadow-lg">
                    {/* Main Bar */}
                    <div className="flex h-16 items-center justify-between px-6">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <img
                                src={logo}
                                alt="Campus Connect"
                                className="h-9 w-9 rounded-lg object-contain"
                            />
                            <span className="text-lg font-semibold text-slate-900 dark:text-white">
                                Campus
                                <span className="ml-1 text-sky-400">Connect</span>
                            </span>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-10 text-sm font-medium relative">
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
                                    {/* Active underline */}
                                    {active === name && (
                                        <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-linear-to-r from-sky-400 to-indigo-400 shadow-md" />
                                    )}
                                </Link>
                            ))}
                            {/* MORE DROPDOWN */}
                            <div
                                className="relative"
                                onClick={() => setMoreOpen(!moreOpen)}
                            >
                                <button
                                    className={`flex items-center gap-2 transition 
                                         ${active === "More"
                                            ? "text-slate-900 dark:text-white"
                                            : "text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white"
                                        }`}
                                >
                                    More
                                    <IoIosArrowDown className={`w-4 h-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                                </button>

                                {/* Dropdown menu */}
                                {moreOpen && (
                                    <div className="absolute top-full mt-7 w-50 rounded-xl bg-[#ECECEC] dark:bg-black border border-indigo-400 shadow-lg backdrop-blur-xl p-2">
                                        {links.slice(3).map(({ name, icon: Icon, to }) => (
                                            <Link
                                                to={to}
                                                key={name}
                                                onClick={() => setActive(name)}
                                                className={`relative ${linkClasses(name)} block px-4 py-2 text-sm text-slate-700 dark:text-white hover:bg-indigo-400/10 rounded-lg transition ${active === name ? "bg-linear-to-r from-sky-400 to-indigo-400 text-white" : ""}`}
                                            >
                                                <Icon />
                                                {name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-3">
                            {!user ?
                                (<Link to="/auth" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white transition">
                                    <FiLogIn /> Login
                                </Link>
                                ) :
                                (<>
                                    <button onClick={logout} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white transition">
                                        <FiLogIn /> Logout
                                    </button>
                                    <Link to="/dashboard" className="rounded-xl bg-linear-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:opacity-90 transition">
                                        Dashboard
                                    </Link>

                                </>)
                            }
                            <button onClick={toggleTheme}>
                                {isDark ? (
                                    <MdOutlineWbSunny className="text-yellow-400 text-xl" />
                                ) : (
                                    <IoMoonOutline className="text-xl text-slate-700" />
                                )}
                            </button>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="md:hidden text-slate-900 dark:text-white text-2xl"
                        >
                            {open ? <FiX /> : <FiMenu />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {open && (
                        <div className="md:hidden border-t border-white/10 px-6 py-4 space-y-4">
                            {links.map(({ name, icon: Icon, href }) => (
                                <Link
                                    href={href}
                                    key={name}
                                    onClick={() => {
                                        setActive(name);
                                        setOpen(false);
                                    }}
                                    className={`flex items-center gap-3 w-full text-left transition
                                        ${active === name
                                            ? "text-slate-900 dark:text-white font-medium"
                                            : "text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white"
                                        }`}
                                >
                                    <Icon />
                                    {name}
                                </Link>
                            ))}

                            <div className="pt-4 border-t border-white/10 space-y-3">
                                {!user ?
                                    (<Link to="/auth" className="flex items-center gap-2 text-smtext-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white transition">
                                        <FiLogIn /> Login
                                    </Link>) :
                                    (<>
                                        <button onClick={logout} className="flex items-center gap-2 text-smtext-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white transition">
                                            <FiLogIn /> Logout
                                        </button>
                                        <Link to="/dashboard" className="w-full rounded-xl bg-linear-to-r from-sky-500 to-indigo-500 px-4 py-2 font-medium text-white shadow-md hover:opacity-90 transition">
                                            Dashboard
                                        </Link>
                                    </>)
                                }
                                <button onClick={toggleMode}>
                                    {isDark ? (
                                        <MdOutlineWbSunny className="text-yellow-400 text-xl" />
                                    ) : (
                                        <IoMoonOutline className="text-xl text-slate-700" />
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Nav;
