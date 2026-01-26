let listeners = [];
let toasts = [];
let id = 0;

const notify = () => {
    listeners.forEach((l) => l(toasts));
};

export const toast = {
    success(message, options = {}) {
        this.show(message, "success", options);
    },
    error(message, options = {}) {
        this.show(message, "error", options);
    },
    loading(message, options = {}) {
        this.show(message, "loading", { duration: Infinity, ...options });
    },
    show(message, type, options) {
        const toast = {
            id: id++,
            message,
            type,
            duration: options.duration ?? 3000,
        };

        toasts = [...toasts, toast];
        notify();

        if (toast.duration !== Infinity) {
            setTimeout(() => {
                this.dismiss(toast.id);
            }, toast.duration);
        }
    },
    dismiss(id) {
        toasts = toasts.filter((t) => t.id !== id);
        notify();
    },
    subscribe(listener) {
        listeners.push(listener);
        listener(toasts);
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    },
};
