import React, { useContext } from "react";
import AuthContext from "./contexts/AuthContext/AuthContext";
import StudentDashboardState from "./contexts/StudentDashboardContext/StudentDashboardState";
import AdminDashboardState from "./contexts/AdminDashboardContext/AdminDashboardState";
import FacultyDashboardState from "./contexts/FacultyDashboardContext/FacultyDashboardState";
import CustomCursor from "./components/CustomCursor";
import { Toaster } from "./Toaster/Toaster";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import PrivateRoute from "./components/PrivateRoute"
import Resources from "./pages/Resources";

import Dashboard from "./pages/Dashboard";
import UserResources from "./pages/DashboardPages/ResourcesPage/UserResources";
import AllUsers from "./pages/DashboardPages/AllUsers";
import Profile from "./pages/DashboardPages/Profile";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import ApprovalPage from "./pages/DashboardPages/ApprovalPage";
import CreateAssignment from "./pages/DashboardPages/AssigmentPage/CreateAssignment";
import TeacherAllAssignment from "./pages/DashboardPages/AssigmentPage/TeacherAllAssignment";
import AssignmentDetails from "./pages/DashboardPages/AssigmentPage/AssigmentDetails";
import StudentAllAssigment from "./pages/DashboardPages/AssigmentPage/StudentAllAssigment";
import { Route, Routes } from "react-router-dom";
import StudentSubmission from "./pages/DashboardPages/SubmissionPage/StudentSubmission";
import AssigmentSubmission from "./pages/DashboardPages/SubmissionPage/AssigmentSubmission";
import AllAssigmentAdmin from "./pages/DashboardPages/AssigmentPage/AllAssigmentAdmin";
import AllSubmissionAdmin from "./pages/DashboardPages/AssigmentPage/AllSubmissionAdmin";
import CampusInsights from "./pages/CampusInsights";
import AddCampusInsights from "./pages/DashboardPages/CampusInsights/AddCampusInsights";
import EditCampusInsight from "./pages/DashboardPages/CampusInsights/EditCampusInsight";
import MyInsights from "./pages/DashboardPages/CampusInsights/MyInsights"
import InsightApproval from "./pages/InsightApproval";
import NotFound from "./pages/NotFound";

const AppRoutes = () => {
    const { user } = useContext(AuthContext);
    return (
        <>
            <CustomCursor />
            <div className="min-h-screen bg-lightmode dark:bg-darkmode transition-colors duration-300 polka">
                <Toaster />

                <AdminDashboardState>
                    <FacultyDashboardState>
                        <StudentDashboardState>
                            <Routes>
                                {/* MAIN SITE (Navbar + Footer) */}
                                <Route element={<MainLayout />}>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/resources" element={<PrivateRoute> <Resources /> </PrivateRoute>} />
                                    <Route path="/campus-insights" element={<CampusInsights />} />
                                </Route>

                                {/* AUTH (No Navbar / Footer) */}
                                <Route element={<AuthLayout />}>
                                    <Route path="*" element={<NotFound />} />
                                    <Route path="/auth" element={<Auth />} />
                                    <Route path="/dashboard" element={<PrivateRoute>  <DashboardLayout /> </PrivateRoute>}>
                                        <Route index element={<Dashboard />} />
                                        <Route path="my-resources" element={<UserResources />} />
                                        <Route path="create-assignment" element={<CreateAssignment />} />
                                        <Route path="assignments" element={
                                            <>
                                                {user?.role === "faculty" && <TeacherAllAssignment />}
                                                {user?.role === "student" && <StudentAllAssigment />}
                                            </>
                                        } />
                                        <Route path="my-submission" element={<StudentSubmission />} />
                                        <Route path="add-insights" element={<AddCampusInsights />} />
                                        <Route path="edit-insight/:id" element={<EditCampusInsight />} />
                                        <Route path="insight-approval" element={<InsightApproval />} />
                                        <Route path="my-insights" element={<MyInsights />} />
                                        <Route path="profile" element={<Profile />} />

                                        <Route path="all-user" element={<AllUsers />} />
                                        <Route path="all-assigment" element={<AllAssigmentAdmin />} />
                                        <Route path="all-submission" element={<AllSubmissionAdmin />} />
                                        <Route path="approval" element={<ApprovalPage />} />
                                    </Route>
                                </Route>
                                <Route path="/assignments/:id" element={<AssignmentDetails />} />
                                <Route path="/submissions/:id" element={<AssigmentSubmission />} />


                            </Routes>
                        </StudentDashboardState>
                    </FacultyDashboardState>
                </AdminDashboardState>
            </div>
        </>
    );
};

export default AppRoutes;
