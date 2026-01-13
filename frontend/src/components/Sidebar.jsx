import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <div className="sidebar-title-container">
          <Users className="sidebar-icon" />
          <span className="sidebar-title-text">Contacts</span>
        </div>
        {/* TODO: Online filter toggle */}
        <div className="sidebar-filter">
          <label className="sidebar-filter-label">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="sidebar-filter-checkbox"
            />
            <span className="sidebar-filter-text">Show online only</span>
          </label>
          <span className="sidebar-online-count">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="sidebar-user-list">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`sidebar-user-btn ${selectedUser?._id === user._id ? "sidebar-user-btn-active" : ""}`}
          >
            <div className="sidebar-avatar-container">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="sidebar-avatar-img"
              />
              {onlineUsers.includes(user._id) && (
                <span className="sidebar-online-badge" />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.fullName}</div>
              <div className="sidebar-user-status">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="sidebar-no-users">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
