import "../ChatContainer.css";
import "./Skeletons.css";

const MessageSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="chat-container-messages">
      {skeletonMessages.map((_, idx) => (
        <div key={idx} className={`chat-message ${idx % 2 === 0 ? "chat-message-start" : "chat-message-end"}`}>
          <div className="chat-message-avatar">
            <div className="chat-message-avatar-inner skeleton-border-0">
              <div className="skeleton-base skeleton-circle" />
            </div>
          </div>

          <div className="chat-message-header">
            <div className="skeleton-base skeleton-text-sm" />
          </div>

          <div className="chat-message-bubble skeleton-bg-transparent">
            <div className="skeleton-base skeleton-bubble" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
