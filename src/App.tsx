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

import StudentJournal from "./pages/student/studentJournal";
import StudentProject from "./pages/student/StudentProject";
import StudentSprints from "./pages/student/StudentSprints";
import StudentOverview from "./pages/student/overview/StudentOverview";
import StudentReports from "./pages/student/StudentReports";
import StudentValidations from "./pages/student/StudentValidations";
import StudentTasks from "./pages/student/StudentTasks";
import StudentTaskHistory from "./pages/student/StudentTaskHistory";
import StudentMeetings from "./pages/student/StudentMeetings";
import CreateMeeting from "./pages/student/CreateMeeting";

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
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ─── Student ──────────────────────────────────────────── */}
        <Route path="/student" element={<StudentDashboard />}>
          <Route
            index
            element={<Navigate to="/student/dashboard" replace />}
          />
          <Route path="meetings" element={<StudentMeetings />} />
          <Route path="meetings/create" element={<CreateMeeting />} />
          <Route path="tasks/history" element={<StudentTaskHistory />} />
          <Route path="tasks" element={<StudentTasks />} />
          <Route path="journal" element={<StudentJournal />} />
          <Route path="project" element={<StudentProject />} />
          <Route path="sprints" element={<StudentSprints />} />
          <Route path="dashboard" element={<StudentOverview />} />
          <Route path="stories" element={<StudentSprints />} />
          <Route path="reports" element={<StudentReports />} />
          <Route path="validations" element={<StudentValidations />} />
        </Route>

        {/* ─── University Supervisor ───────────────────────────── */}
        <Route
          path="/uni/dashboard"
          element={<UniversitySupervisorDashboard />}
        />

        {/* ─── Company Supervisor ──────────────────────────────── */}
        <Route path="/com/dashboard" element={<CompanySupervisorDashboard />} />

        {/* Default fallback */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
