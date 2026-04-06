import {
    FiHome,
    FiBookOpen,
    FiEdit,
    FiUser,
    FiUsers,
    FiChevronDown,
    FiClipboard
} from "react-icons/fi";
import { MdAssignmentTurnedIn } from "react-icons/md";

export const DASHBOARD_CONFIG = {
    student: {
        label: "Study Mode",
        nav: [
            { label: "Dashboard", icon: FiHome, path: "/dashboard" },
            { label: "Resources", icon: FiBookOpen, path: "/dashboard/my-resources" },
            {
                label: "Assignments",
                icon: FiClipboard,
                children: [
                    {
                        label: "Assignment",
                        icon: MdAssignmentTurnedIn,
                        path: "/dashboard/assignments",
                    },
                    {
                        label: "My Submission",
                        icon: MdAssignmentTurnedIn,
                        path: "/dashboard/my-submission",
                    },
                ],
            },
            {
                label: "Campus Insights",
                icon: FiEdit,
                children: [
                    { label: "Add Insights", icon: FiEdit, path: "/dashboard/add-insights" },
                    { label: "My Insights", icon: FiEdit, path: "/dashboard/my-insights" },
                ]
            },
            { label: "Profile", icon: FiUser, path: "/dashboard/profile" },
        ],
    },

    faculty: {
        label: "Teaching Mode",
        nav: [
            { label: "Dashboard", icon: FiHome, path: "/dashboard" },
            { label: "Resources", icon: FiBookOpen, path: "/dashboard/my-resources" },

            {
                label: "Assignments",
                icon: FiClipboard,
                children: [
                    {
                        label: "Create Assignment",
                        icon: MdAssignmentTurnedIn,
                        path: "/dashboard/create-assignment",
                    },
                    {
                        label: "My Assignments",
                        icon: MdAssignmentTurnedIn,
                        path: "/dashboard/assignments",
                    },
                ],
            },

            {
                label: "Campus Insights",
                icon: FiEdit,
                children: [
                    { label: "Add Insights", icon: FiEdit, path: "/dashboard/add-insights" },
                    { label: "My Insights", icon: FiEdit, path: "/dashboard/my-insights" },
                ]
            },
            { label: "Profile", icon: FiUser, path: "/dashboard/profile" },
        ],
    },

    admin: {
        label: "Admin Panel",
        nav: [
            { label: "Overview", icon: FiHome, path: "/dashboard" },
            { label: "Approval", icon: FiHome, path: "/dashboard/approval" },
            { label: "Insight Approval", icon: FiHome, path: "/dashboard/insight-approval" },
            { label: "Users", icon: FiUsers, path: "/dashboard/all-user" },
            {
                label: "All Assignments",
                icon: FiClipboard,
                children: [
                    {
                        label: "All Assignments",
                        icon: MdAssignmentTurnedIn,
                        path: "/dashboard/all-assigment",
                    },
                    {
                        label: "All Submission",
                        icon: MdAssignmentTurnedIn,
                        path: "/dashboard/all-submission",
                    },
                ],
            },
            { label: "Profile", icon: FiUser, path: "/dashboard/profile" },
        ],
    },
};
