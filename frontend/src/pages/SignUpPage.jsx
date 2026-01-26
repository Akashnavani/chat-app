import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";
import "./SignUpPage.css";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) {
      signup(formData);
    }
  };

  return (
    <div className="auth-page-container">
      {/* left side */}
      <div className="auth-form-wrapper">
        <div className="auth-form-content">
          {/* LOGO */}
          <div className="auth-logo-container">
            <div className="auth-logo-group">
              <div className="auth-logo-box">
                <MessageSquare className="auth-logo-icon" />
              </div>
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
              {/* FULL NAME */}
              <div className="auth-form-control">
                <label className="auth-label">
                  <span className="auth-label-text">Full Name</span>
                </label>
                <div className="auth-input-container">
                  <div className="auth-input-icon-left">
                    <User className="auth-icon" />
                  </div>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* EMAIL */}
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
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* PASSWORD */}
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
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
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

              {/* SUBMIT BUTTON */}
              <button type="submit" className="auth-submit-btn" disabled={isSigningUp}>
                {isSigningUp ? (
                  <>
                    <Loader2 className="auth-spinner" />
                    Loading...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

          {/* FOOTER */}
          <div className="auth-footer">
            <p className="auth-subtitle">
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;
