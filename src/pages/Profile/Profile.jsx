import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProfileInfo } from "../../services/profileService";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user?.email) {
      (async () => {
        const data = await getProfileInfo(user.email);
        if (!data.error) {
          setProfile(data);
        }
      })();
    }
  }, [user]);

  if (!profile) return <p className="loading">Loading profile...</p>;

  return (
    <div className="profile-page">
      <h2 className="page-title">My Profile</h2>

      <div className="profile-card">
        <div className="profile-avatar">
          {profile.avatarBase64Data ? (
            <img src={profile.avatarBase64Data} alt="Profile" />
          ) : (
            <div className="profile-placeholder">{profile.userName?.[0]}</div>
          )}
        </div>

        <div className="profile-details">
          <div className="profile-field">
            <span className="label">Name:</span>
            <span className="value">{profile.userName}</span>
          </div>
          <div className="profile-field">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="profile-field">
            <span className="label">User ID:</span>
            <span className="value">
              {profile.userID
                ? profile.userID.slice(0, 5) + "*".repeat(profile.userID.length - 5)
                : "-"}
            </span>
          </div>
          <div className="profile-field">
            <span className="label">Registration Date:</span>
            <span className="value">{profile.registrationDate}</span>
          </div>
          <div className="profile-field">
            <span className="label">Verified:</span>
            {profile.isverified === "false" && (
              <span className="value">No</span>
            )}
            {profile.isverified === "true" && (
              <span className="value">Yes</span>
            )}
          </div>
          <div className="profile-field">
            <span className="label">Gender:</span>
            <span className="value">{profile.gender || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
