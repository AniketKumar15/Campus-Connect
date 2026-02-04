import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CustomCursor from "./components/CustomCursor";
import { Toaster } from "./Toaster/Toaster";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import AuthState from "./contexts/AuthContext/AuthState";
import PrivateRoute from "./components/PrivateRoute"
import Resources from "./pages/Resources";
import ResourceState from "./contexts/ResourceContext/ResourceState";

import Dashboard from "./pages/Dashboard";
import UserResources from "./pages/DashboardPages/UserResources";
import AddBlogs from "./pages/DashboardPages/AddBlogs";
import AllUsers from "./pages/DashboardPages/AllUsers";
import Profile from "./pages/DashboardPages/Profile";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import ApprovalPage from "./pages/DashboardPages/ApprovalPage";
import CreateAssignment from "./pages/DashboardPages/CreateAssignment";
import AssignmentState from "./contexts/AssignmentContext/AssignmentState";
import TeacherAllAssignment from "./pages/DashboardPages/TeacherAllAssignment";
import AssignmentDetails from "./pages/DashboardPages/AssigmentDetails";

import { ThemeProvider } from "./contexts/ThemeContext";



const App = () => {
  return (
    <ThemeProvider>
      <AuthState>
        <ResourceState>
          <AssignmentState>
            <Router>
              <CustomCursor />
              <div className="min-h-screen bg-lightmode dark:bg-darkmode transition-colors duration-300 polka">
                <Toaster />

                <Routes>
                  {/* MAIN SITE (Navbar + Footer) */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/resources" element={<PrivateRoute> <Resources /> </PrivateRoute>} />
                  </Route>

                  {/* AUTH (No Navbar / Footer) */}
                  <Route element={<AuthLayout />}>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/dashboard" element={<PrivateRoute>  <DashboardLayout /> </PrivateRoute>}>
                      <Route index element={<Dashboard />} />
                      <Route path="my-resources" element={<UserResources />} />
                      <Route path="create-assignment" element={<CreateAssignment />} />
                      <Route path="my-assignments" element={<TeacherAllAssignment />} />
                      <Route path="add-blog" element={<AddBlogs />} />
                      <Route path="profile" element={<Profile />} />

                      <Route path="all-user" element={<AllUsers />} />
                      <Route path="approval" element={<ApprovalPage />} />
                    </Route>
                  </Route>
                  <Route path="/assignments/:id" element={<AssignmentDetails />} />

                </Routes>
              </div>
            </Router>
          </AssignmentState>
        </ResourceState>
      </AuthState>
    </ThemeProvider>
  );
};

export default App;
