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
        <footer className="relative z-10">
            {/* Physical Shelf Divider */}
            {/* <div className="h-2 w-full bg-slate-300 shadow-[inset_0_1px_3px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.8)]" /> */}

            <div className="bg-slate-200 border-top border-white/60 shadow-[inset_0_4px_10px_rgba(255,255,255,0.7),0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-3">

                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-extrabold text-slate-800 drop-shadow-sm">
                            Campus Connect
                        </h3>
                        <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                            A modern digital platform that connects students, faculty,
                            and institutions into one unified campus ecosystem.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wide text-slate-800 drop-shadow-sm">
                            Platform
                        </h4>
                        <div className="mt-3 h-[2px] w-8 bg-slate-300 rounded shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)]"></div>
                        <ul className="mt-4 space-y-3 text-sm font-medium text-slate-600">
                            {["Dashboard", "Features", "Events", "Resources"].map((item) => (
                                <li
                                    key={item}
                                    className="hover:text-blue-600 transition cursor-pointer"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wide text-slate-800 drop-shadow-sm">
                            Connect
                        </h4>
                        <div className="mt-3 h-[2px] w-8 bg-slate-300 rounded shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)]"></div>
                        <div className="mt-6 flex gap-4">
                            {socials.map(({ icon: Icon, link }, i) => (
                                <motion.a
                                    key={i}
                                    href={link}
                                    whileTap={{ scale: 0.95, y: 2 }}
                                    className="p-3 rounded-xl bg-gradient-to-b from-slate-100 to-slate-300 text-slate-700 shadow-[0_5px_10px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.8)] border-b-4 border-slate-400 active:border-b-0 hover:text-blue-600 transition-all flex items-center justify-center"
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-slate-600">
                        <span>
                            © {new Date().getFullYear()} Campus Connect. All rights reserved.
                        </span>

                        <span>
                            Built with ❤️ by{" "}
                            <span className="font-bold text-slate-800 drop-shadow-sm">
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
