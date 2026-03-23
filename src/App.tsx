import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import type { JSX } from "react";
//import Login from "@/pages/auth/Login";
import UniversitySupervisorDashboard from "@/pages/university_supervisor/UniversitySupervisorDashboard";
import CompanySupervisorDashboard from "@/pages/company_supervisor/CompanySupervisorDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signup";
import ResetPasswordPage from "./pages/auth/reset-password";
import HelloPage from "./pages/student/HelloPage";
import CreateMeeting from "@/pages/student/CreateMeeting";

// Example auth context or state
const fakeAuth = {
  isLoggedIn: true,
  userRole: "university_supervisor",
};

// PrivateRoute wrapper
function PrivateRoute({
  children,
  role,
}: {
  children: JSX.Element;
  role: string;
}) {
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* University Supervisor dashboard */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/uni/dashboard"
          element={
            <PrivateRoute role="UniSupervisor">
              <UniversitySupervisorDashboard />
            </PrivateRoute>
          }
        >
          {/* Default view when navigating strictly to /uni/dashboard */}
          <Route index element={<div>Welcome to the University Supervisor Dashboard</div>} />

        </Route>
        <Route
          path="/com/dashboard"
          element={
            <PrivateRoute role="CompSupervisor">
              <CompanySupervisorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute role="Student">
              <StudentDashboard />
            </PrivateRoute>
          }
        >
          {/* Default page */}
          <Route index element={<div>Student Home</div>} />

          {/* Your new route */}
          <Route path="hello" element={<HelloPage />} />

          {/* Meeting Routes mapped to our sidebar links */}
          <Route path="meetings" element={<div>List of all meetings (Toutes les réunions) will go here!</div>} />
          <Route path="meetings/pending-validation" element={<div>Pending validation meetings will go here!</div>} />
          <Route path="meetings/create" element={<CreateMeeting />} />
          <Route path="meetings/search" element={<div>Search meetings by Project/Reference will go here!</div>} />
        </Route>

        {/* Default/fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
