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
        <div className="pt-28 overflow-x-hidden bg-[#eef2f6] min-h-screen font-sans text-slate-800 relative z-0">

            {/* Grid Pattern Background */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">
                </div>
            </div>
            <section
                className="relative px-6"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Ambient Light Sources */}
                <motion.div
                    style={{ y: orbY, x: mouseX }}
                    className="absolute -top-40 left-0 h-[600px] w-[600px] rounded-full bg-white/60 blur-[100px] pointer-events-none"
                />
                <motion.div
                    style={{ y: orbY, x: mouseY }}
                    className="absolute top-40 right-0 h-[500px] w-[500px] rounded-full bg-slate-300/40 blur-[100px] pointer-events-none"
                />

                {/* Content */}
                <motion.div
                    style={{ y: heroY, x: mouseX }}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    transition={{ duration: 0.8 }}
                    className="relative mx-auto max-w-6xl text-center h-screen mt-35"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-800 drop-shadow-sm">
                        A Unified Digital Platform for
                        <span className="block mt-3 text-blue-700">
                            Campus Collaboration
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 font-medium">
                        Campus Connect digitizes academic communication, learning resources,
                        and campus activities into one tactile, role-based system.
                    </p>

                    <div className="mt-10 flex justify-center gap-6">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 px-8 py-3 text-white font-bold shadow-[0_8px_15px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all"
                        >
                            Go to Dashboard
                        </motion.button>
                        <motion.button
                            onClick={() =>
                                document
                                    .getElementById("features")
                                    .scrollIntoView({ behavior: "smooth" })
                            }
                            className="rounded-xl bg-gradient-to-b from-slate-100 to-slate-300 px-8 py-3 text-slate-700 font-bold shadow-[0_5px_10px_rgba(0,0,0,0.15),inset_0_2px_0_rgba(255,255,255,0.8)] border-b-4 border-slate-400 active:border-b-0 active:translate-y-1 transition-all"
                        >
                            Learn More
                        </motion.button>
                    </div>
                </motion.div>
            </section>


            {/* WHO IT'S FOR */}
            <section className="mt-32 px-6" id="features">
                <div className="mx-auto max-w-6xl">
                    <h2 className="text-3xl font-bold text-center text-slate-800 drop-shadow-sm">
                        Designed for Your Campus
                    </h2>

                    <div className="mt-14 grid gap-8 md:grid-cols-3">
                        {["Students", "Faculty", "Institution"].map((role, i) => (
                            <motion.div
                                key={role}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.3 }}
                                transition={{ delay: i * 0.15, duration: 0.6 }}
                                className="rounded-2xl bg-slate-200 border-t border-l border-white p-8 shadow-[8px_12px_20px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)]"
                            >
                                <h3 className="text-xl font-bold text-slate-800">
                                    {role}
                                </h3>
                                <div className="mt-3 h-[2px] w-12 bg-slate-300 rounded shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)]"></div>
                                <p className="mt-4 text-sm font-medium text-slate-600 leading-relaxed">
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
            <section className="mt-32 px-6">
                <div className="mx-auto max-w-6xl">
                    <h2 className="text-3xl font-bold text-center text-slate-800 drop-shadow-sm">
                        Core Capabilities
                    </h2>

                    <div className="mt-14 grid gap-8 md:grid-cols-2">
                        {features.map(({ title, desc, icon: Icon }, i) => (
                            <motion.div
                                key={title}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.3 }}
                                transition={{ delay: i * 0.15, duration: 0.6 }}
                                className="flex gap-6 rounded-2xl bg-slate-200 border-t border-l border-white p-6 shadow-[8px_12px_20px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_6px_rgba(255,255,255,0.7)]"
                            >
                                <div className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-slate-200 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6),0_4px_6px_rgba(0,0,0,0.2)] border border-slate-600">
                                    <Icon size={24} />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h3 className="text-lg font-bold text-slate-800">
                                        {title}
                                    </h3>
                                    <p className="mt-2 text-sm font-medium text-slate-600">
                                        {desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="mt-32 px-6 pb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.4 }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-slate-200 to-slate-400 p-12 text-center shadow-[15px_25px_40px_rgba(0,0,0,0.15),inset_-4px_-4px_10px_rgba(0,0,0,0.1),inset_4px_4px_15px_rgba(255,255,255,0.8)] border-t border-l border-white/80"
                >
                    <h2 className="text-3xl font-bold text-slate-800 drop-shadow-sm">
                        Built Specifically for Your College
                    </h2>
                    <p className="mt-4 text-slate-700 font-medium">
                        Simplify academic collaboration with a modern, tactile digital experience.
                    </p>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="mt-8 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 px-8 py-3 text-white font-bold shadow-[0_8px_15px_rgba(0,0,0,0.3),inset_0_2px_0_rgba(255,255,255,0.3)] border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all"
                    >
                        Enter Platform
                    </motion.button>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
