import { BrowserRouter as Router } from "react-router-dom";

import AuthState from "./contexts/AuthContext/AuthState";
import ResourceState from "./contexts/ResourceContext/ResourceState";
import AssignmentState from "./contexts/AssignmentContext/AssignmentState";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppRoutes from "./AppRoutes";
import SubmissionState from "./contexts/SubmissionContext/SubmissionState";
import AdminUserState from "./contexts/AdminUserContext/AdminUserState";
import CampusInsightState from "./contexts/CampusInsightContext/CampusInsightState";

const App = () => {

  return (
    <ThemeProvider>
      <AuthState>
        <ResourceState>
          <AssignmentState>
            <SubmissionState>
              <CampusInsightState>
                <AdminUserState>
                  <Router>
                    <AppRoutes />
                  </Router>
                </AdminUserState>
              </CampusInsightState>
            </SubmissionState>
          </AssignmentState>
        </ResourceState>
      </AuthState>
    </ThemeProvider>
  );
};

export default App;
