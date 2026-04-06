import { useState, useContext } from "react";
import { motion } from "framer-motion";
import AuthContext from "../contexts/AuthContext/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Auth = () => {
    const { login, signup, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { name, email, password } = formData;

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    /* =========================
       HANDLE CHANGE
    ========================== */
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /* =========================
       HANDLE SUBMIT
    ========================== */
    const onSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            const success = await login(email, password);
            if (success) navigate("/");
        } else {
            const success = await signup(name, email, password);
            if (success) setIsLogin(true);
        }
    };

    return (
        <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-[#eef2f6] font-sans">
            {/* LEFT */}
            <div className="relative hidden md:flex items-center justify-center overflow-hidden border-r border-slate-300 shadow-[inset_-2px_0_6px_rgba(0,0,0,0.1)]">
                <img
                    src="/image.png"
                    alt="Campus Connect"
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/70" />
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-xl text-center px-10"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white flex gap-3 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                        Campus
                        <span className="text-blue-400">
                            Connect
                        </span>
                    </h1>
                    <p className="mt-6 text-lg font-bold text-slate-100 drop-shadow-md">
                        Connect with your campus community. Share resources, explore events,
                        and grow together.
                    </p>
                    <div className="mt-8 h-[3px] w-28 mx-auto rounded-full bg-blue-500 shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)]" />
                </motion.div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center justify-center px-6 py-12 relative z-0">
                {/* Grid Pattern Background for Auth Side */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">
                    </div>
                </div>

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md rounded-3xl bg-slate-200 border-t border-l border-white shadow-[10px_15px_30px_rgba(0,0,0,0.15),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)] p-10"
                >
                    <h2 className="text-3xl font-extrabold text-slate-800 drop-shadow-sm mb-2">
                        {isLogin ? "Welcome Back!" : "Create Your Account"}
                    </h2>
                    <p className="text-sm font-bold text-slate-500 mb-8">
                        {isLogin
                            ? "Login to continue to Campus Connect"
                            : "Sign up to start your journey"}
                    </p>

                    <form className="space-y-5" onSubmit={onSubmit}>
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1 drop-shadow-sm">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    required
                                    placeholder="John Doe"
                                    className="w-full rounded-xl bg-slate-100 border border-t-slate-400 border-l-slate-400 border-b-white border-r-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 font-medium"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 drop-shadow-sm">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                                placeholder="you@example.com"
                                className="w-full rounded-xl bg-slate-100 border border-t-slate-400 border-l-slate-400 border-b-white border-r-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 drop-shadow-sm">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                placeholder="••••••••"
                                className="w-full rounded-xl bg-slate-100 border border-t-slate-400 border-l-slate-400 border-b-white border-r-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.8)] px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 font-medium"
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-6 w-full py-4 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 text-white font-extrabold tracking-wide shadow-[0_5px_10px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-[3px] border-blue-800 active:border-b-0 active:translate-y-[2px] transition-all"
                        >
                            {isLogin ? "Login" : "Sign Up"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm font-bold text-slate-500">
                        {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-blue-600 hover:text-blue-800 transition-colors drop-shadow-sm"
                        >
                            {isLogin ? "Sign up" : "Login"}
                        </button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Auth;
