import { Users } from "lucide-react";
import "./Skeletons.css";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonItems = Array(8).fill(null);

  return (
    <aside className="sidebar-container">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-title-container">
          <Users className="sidebar-icon" />
          <span className="sidebar-title-text">Contacts</span>
        </div>
      </div>

      {/* Skeleton Items */}
      <div className="sidebar-user-list">
        {skeletonItems.map((_, idx) => (
          <div key={idx} className="sidebar-skeleton-item">
            {/* Avatar skeleton */}
            <div className="skeleton-base skeleton-avatar-lg" />
            {/* User Info skeleton - only visible on larger screens */}
            <div className="sidebar-user-info">
              <div className="skeleton-base skeleton-text-md" />
              <div className="skeleton-base skeleton-text-xs" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
