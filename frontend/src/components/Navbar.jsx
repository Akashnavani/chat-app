import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-inner">
          <div className="navbar-left">
            <Link to="/" className="navbar-logo-link">
              <div className="navbar-logo-icon">
                <MessageSquare className="navbar-logo-svg" />
              </div>
              <h1 className="navbar-title">Chat App</h1>
            </Link>
          </div>

          <div className="navbar-right">
            <Link to={"/settings"} className="navbar-btn">
              <Settings className="navbar-btn-icon" />
              <span className="navbar-btn-text">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className="navbar-btn">
                  <User className="navbar-btn-icon-lg" />
                  <span className="navbar-btn-text">Profile</span>
                </Link>

                <button className="navbar-logout-btn" onClick={logout}>
                  <LogOut className="navbar-btn-icon-lg" />
                  <span className="navbar-btn-text">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
