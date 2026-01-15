import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import "./ChatContainer.css";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Subscribe only when selectedUser changes
  useEffect(() => {
    if (!selectedUser?._id) return;

    // Load previous messages
    getMessages(selectedUser._id);

    // Start listening to realtime newMessage events
    subscribeToMessages();

    // Cleanup previous socket listeners when switching chats
    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser?._id]);

  // â­  Auto scroll to latest message
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="chat-container-wrapper">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="chat-container-wrapper">
      <ChatHeader />

      <div className="chat-container-messages">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat-message ${
              message.senderId === authUser._id ? "chat-message-end" : "chat-message-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-message-avatar">
              <div className="chat-message-avatar-inner">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-message-header">
              <time className="chat-message-time">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div className="chat-message-bubble">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="chat-message-attachment"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
