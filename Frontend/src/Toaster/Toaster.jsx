import { useEffect, useState } from "react";
import { toast } from "./toast";

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
            toast toast-enter
            pointer-events-auto
            flex items-center gap-3
            min-w-70 max-w-sm
            rounded-xl px-4 py-3
            shadow-lg shadow-black/10
            backdrop-blur-md
            border border-white/10
            text-sm font-medium text-white
            transition-transform
            ${t.type === "success" && "bg-emerald-500/90"}
            ${t.type === "error" && "bg-rose-500/90"}
            ${t.type === "loading" && "bg-sky-500/90"}
          `}
                >
                    {/* Icon */}
                    {t.type === "loading" ? (
                        <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                        <span className="text-lg">
                            {t.type === "success"}
                            {t.type === "error"}
                        </span>
                    )}

                    <span className="flex-1">{t.message}</span>
                </div>
            ))}
        </div>
    );
};
