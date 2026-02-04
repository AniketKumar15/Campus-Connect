import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen overflow-hidden bg-white dark:bg-[#05070F] text-white flex">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="flex-1 overflow-y-auto px-10 py-8 space-y-10">
                <Outlet />
            </main>
        </div>
    );
}
