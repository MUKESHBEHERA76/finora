import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import LogIn from "./pages/auth/LogIn";
import SignUp from "./pages/auth/SignUp";
import ResetPwd from "./pages/auth/ResetPwd"
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import NotFound from "./pages/NotFound/NotFound";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import "./App.css";

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<PublicRoute><LogIn /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPwd /></PublicRoute>} />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Sidebar
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                  />
                  <div className={`main-wrapper ${sidebarCollapsed ? "collapsed" : "expanded"} ${mobileOpen ? "mobile-open" : ""}`}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
