// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={<p className="page-text">Home / Dashboard</p>}
          />
          <Route
            path="/profile"
            element={<p className="page-text">Home / Profile</p>}
          />
          <Route
            path="/settings"
            element={<p className="page-text">Home / Settings</p>}
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
