import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import LogIn from "./pages/auth/LogIn";
import SignUp from "./pages/auth/SignUp";
import ResetPwd from "./pages/auth/ResetPwd"
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import NotFound from "./pages/NotFound/NotFound";
import Category from "./pages/Category/Category"
import Transactions from "./pages/Transactions/Transactions"
import Loans from "./pages/Payments/Loans/Loans"
import Bonds from "./pages/Payments/Bonds/Bonds"
import Documents from "./pages/Documents/Documents"
import Cards from "./pages/Cards/Cards"

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
                      <Route path="/payments/loans" element={<Loans />} />
                      <Route path="/payments/bonds" element={<Bonds />} />
                      <Route path="/categories" element={<Category />} />
                      <Route path="/transactions" element={<Transactions />} />
                      <Route path="/documents" element={<Documents />} />
                      <Route path="/cards" element={<Cards />} />
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
