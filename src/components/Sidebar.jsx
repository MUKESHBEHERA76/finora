import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaCog, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import NavItem from "./NavItem";
import { useAuth } from "../context/AuthContext";
import LogoImg from "../assets/logo/Finora_logo.png";
import "./Sidebar.css";
import { getProfileInfo } from "../services/profileService";
import Cookies from "js-cookie";

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [profile, setProfile] = useState({
    userName: "John Doe",
    avatar: null,
    userID: "",
    registrationDate:"",
    isverified:"",
    gender:""
  });

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  useEffect(() => {
    if (user?.email) {
      (async () => {
        const data = await getProfileInfo(user.email);
        if (data.error) {
          alert(data.error);
        } else {
          // store profile data in cookie
          Cookies.set("profile", JSON.stringify(data), { expires: 1 });
          setProfile({
            userName: data.userName,
            avatar: data.avatarBase64Data,
            userID:data.userID,
            registrationDate:data.registrationDate,
            isverified:data.isverified,
            gender:data.gender
          });
        }
      })();
    }
  }, [user]);

  return (
    <>
      <div className="hamburger" onClick={toggleMobile}>
        <FaBars size={24} />
      </div>

      <aside className={`sidebar ${collapsed ? "collapsed" : "expanded"} ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="mobile-close" onClick={toggleMobile}>
          <FaTimes size={20} />
        </div>

        <div className="logo">
          <img src={LogoImg} alt="Logo" className="logo-img" />
        </div>

        <div className="profile">
          <img
            src={profile.avatar}
            alt="Profile"
            className="profile-pic"
          />
          {!collapsed && <h3 className="profile-name">{profile.userName}</h3>}
        </div>

        <nav>
          <ul>
            <NavItem to="/" icon={FaHome} label="Home" collapsed={collapsed} onClick={toggleMobile} />
            <NavItem to="/profile" icon={FaUser} label="Profile" collapsed={collapsed} onClick={toggleMobile} />
            <NavItem to="/settings" icon={FaCog} label="Settings" collapsed={collapsed} onClick={toggleMobile} />
            <NavItem icon={FaSignOutAlt} label="Logout" collapsed={collapsed} onClick={handleLogout} />
          </ul>
        </nav>

        <div className="collapse-btn" onClick={toggleCollapsed}>
          {collapsed ? ">" : "<"}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
