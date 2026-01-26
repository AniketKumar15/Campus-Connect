import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const CustomCursor = () => {
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const move = (e) => {
            setMouse({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", move);

        return () => window.removeEventListener("mousemove", move);
    }, []);

    useEffect(() => {
        const hoverElements = document.querySelectorAll("[data-cursor='hover']");

        hoverElements.forEach((el) => {
            el.addEventListener("mouseenter", () => setIsHovering(true));
            el.addEventListener("mouseleave", () => setIsHovering(false));
        });

        return () => {
            hoverElements.forEach((el) => {
                el.removeEventListener("mouseenter", () => setIsHovering(true));
                el.removeEventListener("mouseleave", () => setIsHovering(false));
            });
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 z-9999 pointer-events-none hidden md:block"
            animate={{
                x: mouse.x - 8,
                y: mouse.y - 8,
                scale: isHovering ? 4 : 1,
                opacity: isHovering ? 0.15 : 1,
            }}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 0.5,
            }}
        >
            <div className="h-4 w-4 rounded-full bg-slate-900 dark:bg-white border border-white dark:border-black" />
        </motion.div>
    );
};

export default CustomCursor;
