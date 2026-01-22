import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-card">
          <div className="profile-header">
            <h1 className="profile-title">Profile</h1>
            <p className="profile-subtitle">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="profile-avatar-img"
              />
              <label
                htmlFor="avatar-upload"
                className={`profile-avatar-upload-btn ${
                  isUpdatingProfile ? "is-uploading" : ""
                }`}
              >
                <Camera className="profile-avatar-icon" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="profile-file-input"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="profile-avatar-hint">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="profile-info-section">
            <div className="profile-info-item">
              <div className="profile-info-label">
                <User className="profile-info-icon" />
                Full Name
              </div>
              <p className="profile-info-value">{authUser?.fullName}</p>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-label">
                <Mail className="profile-info-icon" />
                Email Address
              </div>
              <p className="profile-info-value">{authUser?.email}</p>
            </div>
          </div>

          <div className="profile-account-section">
            <h2 className="profile-account-title">Account Information</h2>
            <div className="profile-account-list">
              <div className="profile-account-item-bordered">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="profile-account-item">
                <span>Account Status</span>
                <span className="profile-status-active">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
