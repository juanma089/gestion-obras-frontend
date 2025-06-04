import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./views/Login/Login";
import AdminView from "./views/admin/AdminView";
import SupervisorView from "./views/supervisor/SupervisorView";
import OperatorView from "./views/operator/OperatorView";
import PasswordRecovery from "./views/Login/PasswordRecovery";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/password-recovery" element={<PasswordRecovery />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
                <AdminView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/supervisor"
            element={
              <ProtectedRoute allowedRoles={["SUPERVISOR"]}>
                <SupervisorView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/operator"
            element={
              <ProtectedRoute allowedRoles={["OPERADOR"]}>
                <OperatorView />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;