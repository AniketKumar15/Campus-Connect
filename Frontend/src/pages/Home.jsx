import { motion, useScroll, useTransform, useMotionValue, animate } from "framer-motion";
import {
    FiUsers,
    FiBookOpen,
    FiCalendar,
    FiGrid,
} from "react-icons/fi";

const features = [
    {
        title: "Centralized Communication",
        desc: "All academic and campus-related communication in one unified platform.",
        icon: FiUsers,
    },
    {
        title: "Learning Resources",
        desc: "Access notes, materials, announcements, and academic updates easily.",
        icon: FiBookOpen,
    },
    {
        title: "Campus Events",
        desc: "Stay updated with college events, activities, and important schedules.",
        icon: FiCalendar,
    },
    {
        title: "Role-Based Dashboards",
        desc: "Personalized dashboards for students and faculty with relevant tools.",
        icon: FiGrid,
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

const Home = () => {
    const { scrollY } = useScroll();

    // scroll parallax
    const heroY = useTransform(scrollY, [0, 600], [0, -120]);
    const orbY = useTransform(scrollY, [0, 600], [0, -200]);

    // mouse parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX - innerWidth / 2) / 30;
        const y = (e.clientY - innerHeight / 2) / 30;

        mouseX.set(x);
        mouseY.set(y);
    };
    const handleMouseLeave = () => {
        animate(mouseX, 0, { duration: 0.6, ease: "easeOut" });
        animate(mouseY, 0, { duration: 0.6, ease: "easeOut" });
    };

    return (
        <div className="pt-28 overflow-x-hidden">
            <section
                className="relative px-6"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Background Orbs */}
                <motion.div
                    style={{ y: orbY, x: mouseX }}
                    className="absolute -top-40 left-1/2 -translate-x-1/2 h-105 w-105 rounded-full bg-sky-400/30 blur-[140px]"
                />
                <motion.div
                    style={{ y: orbY, x: mouseY }}
                    className="absolute top-40 left-1/4 h-75 w-75 rounded-full bg-indigo-400/30 blur-[120px]"
                />

                {/* Content */}
                <motion.div
                    style={{ y: heroY, x: mouseX }}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    transition={{ duration: 0.8 }}
                    className="relative mx-auto max-w-6xl text-center"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        A Unified Digital Platform for
                        <span className="block mt-3 text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-indigo-500">
                            Campus Collaboration
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-white/70">
                        Campus Connect digitizes academic communication, learning resources,
                        and campus activities into one modern, role-based system.
                    </p>

                    <div className="mt-10 flex justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="rounded-xl bg-linear-to-r from-sky-500 to-indigo-500 px-7 py-3 text-white font-medium shadow-lg"
                        >
                            Go to Dashboard
                        </motion.button>
                        <motion.button
                            onClick={() =>
                                document
                                    .getElementById("features")
                                    .scrollIntoView({ behavior: "smooth" })
                            }
                            whileHover={{ scale: 1.05 }}
                            className="rounded-xl border border-slate-300 dark:border-white/20 px-7 py-3 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
                        >
                            Learn More
                        </motion.button>
                    </div>
                </motion.div>
            </section>


            {/* WHO IT'S FOR */}
            <section className="mt-28 px-6" id="features">
                <div className="mx-auto max-w-6xl">
                    <h2 className="text-3xl font-semibold text-center text-slate-900 dark:text-white">
                        Designed for Your Campus
                    </h2>

                    <div className="mt-14 grid gap-6 md:grid-cols-3">
                        {["Students", "Faculty", "Institution"].map((role, i) => (
                            <motion.div
                                key={role}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.3 }}
                                transition={{ delay: i * 0.15, duration: 0.6 }}
                                whileHover={{ y: -8 }}
                                className="rounded-2xl bg-white/70 dark:bg-black/50 backdrop-blur-xl border border-black/10 dark:border-white/10 p-6 shadow-sm"
                            >
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                    {role}
                                </h3>
                                <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
                                    {role === "Students" &&
                                        "Access academic resources, events, and communication in one place."}
                                    {role === "Faculty" &&
                                        "Manage announcements, resources, and student interactions efficiently."}
                                    {role === "Institution" &&
                                        "A centralized digital system tailored for your college ecosystem."}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="mt-28 px-6">
                <div className="mx-auto max-w-6xl">
                    <h2 className="text-3xl font-semibold text-center text-slate-900 dark:text-white">
                        Core Capabilities
                    </h2>

                    <div className="mt-14 grid gap-6 md:grid-cols-2">
                        {features.map(({ title, desc, icon: Icon }, i) => (
                            <motion.div
                                key={title}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.3 }}
                                transition={{ delay: i * 0.15, duration: 0.6 }}
                                whileHover={{ scale: 1.02 }}
                                className="flex gap-4 rounded-2xl bg-white/70 dark:bg-black/50 backdrop-blur-xl border border-black/10 dark:border-white/10 p-6"
                            >
                                <div className="h-12 w-24 md:w-12 flex items-center justify-center rounded-xl bg-linear-to-r from-sky-500 to-indigo-500 text-white">
                                    <Icon size={22} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {title}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-white/70">
                                        {desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="mt-28 px-6 pb-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.4 }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-5xl rounded-3xl bg-linear-to-r from-sky-500 to-indigo-500 p-12 text-center text-white shadow-xl"
                >
                    <h2 className="text-3xl font-semibold">
                        Built Specifically for Your College
                    </h2>
                    <p className="mt-4 text-white/90">
                        Simplify academic collaboration with a modern, unified digital experience.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="mt-8 rounded-xl bg-white px-7 py-3 font-medium text-slate-900"
                    >
                        Enter Platform
                    </motion.button>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
