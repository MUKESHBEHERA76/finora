// src/components/NavItem.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavItem = ({ to, icon: Icon, label, collapsed, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li className={`nav-item ${isActive ? "active" : ""}`} onClick={onClick}>
      <Link to={to} className="nav-link">
        {Icon && <Icon className="nav-icon" />}
        {!collapsed && <span className="nav-label">{label}</span>}
      </Link>
    </li>
  );
};

export default NavItem;
