import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import "./LoginPage.css";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="auth-page-container">
      {/* Left Side - Form */}
      <div className="auth-form-wrapper">
        <div className="auth-form-content">
          {/* Logo */}
          <div className="auth-logo-container">
            <div className="auth-logo-group">
              <div className="auth-logo-box">
                <MessageSquare className="auth-logo-icon" />
              </div>
              <h1 className="auth-title">Welcome Back</h1>
              <p className="auth-subtitle">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-control">
              <label className="auth-label">
                <span className="auth-label-text">Email</span>
              </label>
              <div className="auth-input-container">
                <div className="auth-input-icon-left">
                  <Mail className="auth-icon" />
                </div>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="auth-form-control">
              <label className="auth-label">
                <span className="auth-label-text">Password</span>
              </label>
              <div className="auth-input-container">
                <div className="auth-input-icon-left">
                  <Lock className="auth-icon" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="auth-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="auth-input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="auth-icon" />
                  ) : (
                    <Eye className="auth-icon" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="auth-spinner" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-subtitle">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="auth-link">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  );
};
export default LoginPage;
