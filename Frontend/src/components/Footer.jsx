import { motion } from "framer-motion";
import {
    FiGithub,
    FiLinkedin,
    FiTwitter,
    FiMail,
} from "react-icons/fi";

const socials = [
    { icon: FiGithub, link: "#" },
    { icon: FiLinkedin, link: "#" },
    { icon: FiTwitter, link: "#" },
    { icon: FiMail, link: "mailto:example@email.com" },
];

const Footer = () => {
    return (
        <footer className="relative mt-32">
            {/* Gradient Divider */}
            <div className="h-px w-full bg-linear-to-r from-transparent via-sky-400/40 to-transparent" />

            <div className="bg-white dark:bg-black">
                <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-3">

                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Campus Connect
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-white/70">
                            A modern digital platform that connects students, faculty,
                            and institutions into one unified campus ecosystem.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
                            Platform
                        </h4>
                        <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-white/70">
                            {["Dashboard", "Features", "Events", "Resources"].map((item) => (
                                <li
                                    key={item}
                                    className="hover:text-sky-500 transition cursor-pointer"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
                            Connect
                        </h4>
                        <div className="mt-4 flex gap-4">
                            {socials.map(({ icon: Icon, link }, i) => (
                                <motion.a
                                    key={i}
                                    href={link}
                                    whileHover={{ y: -4, scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white hover:text-sky-500 dark:hover:text-sky-400 transition"
                                >
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-black/10 dark:border-white/10">
                    <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600 dark:text-white/60">
                        <span>
                            © {new Date().getFullYear()} Campus Connect. All rights reserved.
                        </span>

                        <span>
                            Built with ❤️ by{" "}
                            <span className="font-semibold text-slate-900 dark:text-white">
                                Aniket Kumar
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
