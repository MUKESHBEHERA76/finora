// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";

// Import page components
import LogIn from "./pages/auth/LogIn";
import SignUp from "./pages/auth/SignUp";
import ResetPwd from "./pages/auth/ResetPwd";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";



//404 not found page
import NotFound from "./pages/NotFound/NotFound"

// This component will live inside Router, so useLocation works here
function AppContent() {
  const location = useLocation();

  // Routes where Sidebar should be hidden
  const noSidebarRoutes = ["/login", "/signup", "/reset-password"];
  const hideSidebar = noSidebarRoutes.includes(location.pathname);

  return (
    <>
      {!hideSidebar && <Sidebar />}
      <main className="main-content">
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />

          {/* Auth pages */}
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPwd />} />

          {/* Settings placeholder */}
          <Route path="/settings" element={<p>Settings Page</p>} />



          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
