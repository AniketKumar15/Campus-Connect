import {
    FiHome,
    FiBookOpen,
    FiEdit,
    FiUser,
    FiClock,
    FiUsers
} from "react-icons/fi";

export const DASHBOARD_CONFIG = {
    student: {
        label: "Study Mode",
        nav: [
            { label: "Dashboard", icon: FiHome, path: "/dashboard" },
            { label: "Resources", icon: FiBookOpen, path: "/dashboard/my-resources" },
            { label: "Blogs", icon: FiEdit, path: "/dashboard/add-blog" },
            { label: "Profile", icon: FiUser, path: "/dashboard/profile" },
        ],
    },

    faculty: {
        label: "Teaching Mode",
        nav: [
            { label: "Dashboard", icon: FiHome, path: "/dashboard" },
            { label: "Resources", icon: FiBookOpen, path: "/dashboard/my-resources" },
            { label: "Blogs", icon: FiEdit, path: "/dashboard/blogs" },
            { label: "Profile", icon: FiUser, path: "/dashboard/profile" },
        ],
    },

    admin: {
        label: "Admin Panel",
        nav: [
            { label: "Overview", icon: FiHome, path: "/dashboard" },
            { label: "Approval", icon: FiHome, path: "/dashboard/approval" },
            { label: "Users", icon: FiUsers, path: "/dashboard/all-user" },
            { label: "Profile", icon: FiUser, path: "/dashboard/profile" },
        ],
    },
};
