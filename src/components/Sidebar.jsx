// src/components/Sidebar.jsx
import React, { useState } from "react";
import { FaHome, FaUser, FaCog, FaBars, FaTimes } from "react-icons/fa";
import NavItem from "./NavItem";
import "./Sidebar.css";



//Import images
import LogoImg from "../assets/logo/Finora_logo.png";
import AvatarImg from "../assets/avatar/man.jpg";
import { TbBackground } from "react-icons/tb";



const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <>
      {/* Hamburger button for mobile */}
      <div className="hamburger" onClick={toggleMobile}>
        <FaBars size={24} />
      </div>

      {/* Sidebar */}
      <aside
        className={`sidebar ${collapsed ? "collapsed" : "expanded"} ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
        {/* Mobile close button */}
        <div className="mobile-close" onClick={toggleMobile}>
          <FaTimes size={20} />
        </div>

        {/* Logo area */}
        <div className="logo">
         <img
  src={LogoImg}
  alt="Logo"
  className="logo-img"
  style={{ backgroundColor: "white", padding: "5px", borderRadius: "4px" }}
/>
        </div>

        {/* Profile */}
        <div className="profile">
          <img src={AvatarImg} alt="Profile" className="profile-pic" />
          {!collapsed && <h3 className="profile-name">John Doe</h3>}
        </div>

        {/* Navigation */}
        <nav>
          <ul>
            <NavItem
              to="/"
              icon={FaHome}
              label="Home"
              collapsed={collapsed}
              onClick={toggleMobile}
            />
            <NavItem
              to="/profile"
              icon={FaUser}
              label="Profile"
              collapsed={collapsed}
              onClick={toggleMobile}
            />
            <NavItem
              to="/settings"
              icon={FaCog}
              label="Settings"
              collapsed={collapsed}
              onClick={toggleMobile}
            />
          </ul>
        </nav>

        {/* Collapse button for desktop */}
        <div className="collapse-btn" onClick={toggleCollapsed}>
          {collapsed ? ">" : "<"}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
