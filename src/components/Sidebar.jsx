import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaCog, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import NavItem from "./NavItem";
import { useAuth } from "../context/AuthContext";
import LogoImg from "../assets/logo/Finora_logo.png";
import AvatarImg from "../assets/avatar/man.jpg";
import "./Sidebar.css";

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="hamburger" onClick={toggleMobile}>
        <FaBars size={24} />
      </div>

      <aside className={`sidebar ${collapsed ? "collapsed" : "expanded"} ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Mobile close button */}
        <div className="mobile-close" onClick={toggleMobile}>
          <FaTimes size={20} />
        </div>

        {/* Logo */}
        <div className="logo">
          <img src={LogoImg} alt="Logo" className="logo-img" />
        </div>

        {/* Profile */}
        <div className="profile">
          <img src={AvatarImg} alt="Profile" className="profile-pic" />
          {!collapsed && <h3 className="profile-name">John Doe</h3>}
        </div>

        {/* Navigation */}
        <nav>
          <ul>
            <NavItem to="/" icon={FaHome} label="Home" collapsed={collapsed} onClick={toggleMobile} />
            <NavItem to="/profile" icon={FaUser} label="Profile" collapsed={collapsed} onClick={toggleMobile} />
            <NavItem to="/settings" icon={FaCog} label="Settings" collapsed={collapsed} onClick={toggleMobile} />
            <NavItem icon={FaSignOutAlt} label="Logout" collapsed={collapsed} onClick={handleLogout} />
          </ul>
        </nav>

        {/* Collapse button */}
        <div className="collapse-btn" onClick={toggleCollapsed}>
          {collapsed ? ">" : "<"}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
