import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#05070F] text-white flex">
            <Sidebar sidebarOpen={sidebarOpen} />
            <main className="flex-1 px-10 py-8 space-y-10">
                <Outlet context={{ sidebarOpen, setSidebarOpen }} />
            </main>
        </div>
    );
}
