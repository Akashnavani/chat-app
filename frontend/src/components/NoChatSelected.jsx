import { MessageSquare } from "lucide-react";
import "./NoChatSelected.css";

const NoChatSelected = () => {
  return (
    <div className="no-chat-container">
      <div className="no-chat-content">
        {/* Icon Display */}
        <div className="no-chat-icon-container">
          <div className="no-chat-icon-inner">
            <div className="no-chat-icon-box">
              <MessageSquare className="no-chat-icon" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="no-chat-title">Welcome to Chat App!</h2>
        <p className="no-chat-subtitle">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
