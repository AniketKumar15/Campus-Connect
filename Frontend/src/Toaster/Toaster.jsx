import { useEffect, useState } from "react";
import { toast } from "./toast";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export const Toaster = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        return toast.subscribe(setToasts);
    }, []);

    return (
        <div className="fixed top-4 right-4 z-99999 flex flex-col gap-3">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`
                        pointer-events-auto
                        flex items-start gap-3
                        min-w-70 max-w-sm
                        rounded-xl px-4 py-3
                        backdrop-blur-md
                        border-2
                        shadow-inner shadow-white/10
                        text-sm font-medium
                        animate-toast-in

                        ${t.type === "success" &&
                        "bg-emerald-200/90 border-emerald-600 text-emerald-900"}
                        ${t.type === "error" &&
                        "bg-rose-200/90 border-rose-600 text-rose-900"}
                        ${t.type === "loading" &&
                        "bg-sky-200/90 border-sky-600 text-sky-900"}
                    `}
                >
                    {/* Icon */}
                    <div className="mt-0.5">
                        {t.type === "loading" ? (
                            <span className="h-4 w-4 border-2 border-current/40 border-t-current rounded-full animate-spin" />
                        ) : t.type === "success" ? (
                            <FaCheckCircle className="text-current text-lg" />
                        ) : (
                            <FaTimesCircle className="text-current text-lg" />
                        )}
                    </div>

                    {/* Message */}
                    <span className="flex-1 leading-snug">
                        {t.message}
                    </span>

                    {/* Close Button */}
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="ml-2 text-current/60 hover:text-current transition"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
};
