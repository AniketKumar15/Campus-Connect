import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen overflow-hidden bg-[#eef2f6] text-slate-800 flex font-sans relative z-0">
            {/* Ambient Background Grid Pattern for all Dashboards */}


            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="flex-1 overflow-y-auto px-6 md:px-10 py-8 space-y-10 relative z-10">
                <Outlet />
            </main>
        </div>
    );
}
