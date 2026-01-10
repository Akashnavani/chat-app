import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import "./HomePage.css";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="home-page-container">
      <div className="home-page-wrapper">
        <div className="home-page-box">
          <div className="home-page-inner">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
