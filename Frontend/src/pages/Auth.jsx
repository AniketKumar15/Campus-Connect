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
        <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-slate-900">
            {/* LEFT */}
            <div className="relative hidden md:flex items-center justify-center overflow-hidden">
                <img
                    src="/image.png"
                    alt="Campus Connect"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-br from-black/30 via-black/20 to-black/40" />
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-xl text-center px-10"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white flex gap-3">
                        Campus
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-indigo-500">
                            Connect
                        </span>
                    </h1>
                    <p className="mt-6 text-lg text-white drop-shadow-lg">
                        Connect with your campus community. Share resources, explore events,
                        and grow together.
                    </p>
                    <div className="mt-8 h-1 w-28 mx-auto rounded-full bg-linear-to-r from-sky-400 to-indigo-400" />
                </motion.div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center justify-center px-6 py-12">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md rounded-3xl border border-indigo-400/50 bg-black/50 backdrop-blur-xl shadow-xl p-10"
                >
                    <h2 className="text-3xl font-extrabold text-white mb-2">
                        {isLogin ? "Welcome Back!" : "Create Your Account"}
                    </h2>
                    <p className="text-sm text-white/70 mb-6">
                        {isLogin
                            ? "Login to continue to Campus Connect"
                            : "Sign up to start your journey"}
                    </p>

                    <form className="space-y-4" onSubmit={onSubmit}>
                        {!isLogin && (
                            <div>
                                <label className="block text-sm text-white/70 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    required
                                    placeholder="John Doe"
                                    className="w-full rounded-xl border border-white/30 bg-transparent px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm text-white/70 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-white/30 bg-transparent px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-white/70 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-white/30 bg-transparent px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-linear-to-r from-sky-500 to-indigo-500 py-3 text-white font-medium shadow-lg hover:opacity-90"
                        >
                            {isLogin ? "Login" : "Sign Up"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-white/70">
                        {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-indigo-400 hover:underline font-medium"
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
