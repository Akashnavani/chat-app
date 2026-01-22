import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";
import "./SettingsPage.css";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="settings-container">
      <div className="settings-content">
        <div className="settings-header">
          <h2 className="settings-title">Theme</h2>
          <p className="settings-subtitle">Choose a theme for your chat interface</p>
        </div>

        <div className="settings-theme-grid">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`settings-theme-btn ${
                theme === t ? "settings-theme-btn-active" : "settings-theme-btn-inactive"
              }`}
              onClick={() => setTheme(t)}
            >
              <div className="settings-theme-preview" data-theme={t}>
                <div className="settings-theme-preview-inner">
                  <div className="settings-theme-color settings-theme-color-primary"></div>
                  <div className="settings-theme-color settings-theme-color-secondary"></div>
                  <div className="settings-theme-color settings-theme-color-accent"></div>
                  <div className="settings-theme-color settings-theme-color-neutral"></div>
                </div>
              </div>
              <span className="settings-theme-label">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <h3 className="settings-preview-title">Preview</h3>
        <div className="settings-preview-container">
          <div className="settings-preview-bg">
            <div className="settings-preview-wrapper">
              {/* Mock Chat UI */}
              <div className="settings-preview-chat">
                {/* Chat Header */}
                <div className="settings-preview-header">
                  <div className="settings-preview-user">
                    <div className="settings-preview-avatar">
                      A
                    </div>
                    <div>
                      <h3 className="settings-preview-username">Akash</h3>
                      <p className="settings-preview-status">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="settings-preview-messages">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`settings-preview-message-wrapper ${
                        message.isSent ? "settings-preview-message-sent" : "settings-preview-message-received"
                      }`}
                    >
                      <div
                        className={`settings-preview-bubble ${
                          message.isSent ? "settings-preview-bubble-sent" : "settings-preview-bubble-received"
                        }`}
                      >
                        <p className="settings-preview-text">{message.content}</p>
                        <p
                          className={`settings-preview-time ${
                            message.isSent ? "settings-preview-time-sent" : "settings-preview-time-received"
                          }`}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="settings-preview-input-container">
                  <div className="settings-preview-input-wrapper">
                    <input
                      type="text"
                      className="settings-preview-input"
                      placeholder="Type a message..."
                      value="This is a preview"
                      readOnly
                    />
                    <button className="settings-preview-btn">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
