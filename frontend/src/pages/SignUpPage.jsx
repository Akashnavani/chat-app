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

  // OTP step state
  const [step, setStep] = useState("form"); // "form" or "otp"
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);

  const { sendOtp, verifyOtp, isSendingOtp, isVerifyingOtp } = useAuthStore();

  // Resend cooldown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

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
      const sent = await sendOtp(formData);
      if (sent) {
        setStep("otp");
        setResendTimer(30);
      }
    }
  };

  // Handle OTP digit input
  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return; // only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split("");
    setOtp(digits);
    inputRefs.current[5]?.focus();
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      return toast.error("Please enter the complete 6-digit OTP");
    }
    verifyOtp({ email: formData.email, otp: otpString });
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    const sent = await sendOtp(formData);
    if (sent) {
      setOtp(["", "", "", "", "", ""]);
      setResendTimer(30);
    }
  };

  const handleBackToForm = () => {
    setStep("form");
    setOtp(["", "", "", "", "", ""]);
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
              <h1 className="auth-title">
                {step === "form" ? "Create Account" : "Verify Email"}
              </h1>
              <p className="auth-subtitle">
                {step === "form"
                  ? "Get started with your free account"
                  : `We've sent a 6-digit code to ${formData.email}`}
              </p>
            </div>
          </div>

          {step === "form" ? (
            /* ===== STEP 1: SIGNUP FORM ===== */
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
              <button type="submit" className="auth-submit-btn" disabled={isSendingOtp}>
                {isSendingOtp ? (
                  <>
                    <Loader2 className="auth-spinner" />
                    Sending OTP...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          ) : (
            /* ===== STEP 2: OTP VERIFICATION ===== */
            <form onSubmit={handleVerifyOtp} className="auth-form">
              {/* OTP INPUTS */}
              <div className="otp-input-group" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="otp-input"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* VERIFY BUTTON */}
              <button type="submit" className="auth-submit-btn" disabled={isVerifyingOtp}>
                {isVerifyingOtp ? (
                  <>
                    <Loader2 className="auth-spinner" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Create Account"
                )}
              </button>

              {/* RESEND & BACK */}
              <div className="otp-actions">
                <button
                  type="button"
                  className="otp-resend-btn"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || isSendingOtp}
                >
                  {isSendingOtp ? (
                    "Sending..."
                  ) : resendTimer > 0 ? (
                    `Resend OTP in ${resendTimer}s`
                  ) : (
                    "Resend OTP"
                  )}
                </button>

                <button
                  type="button"
                  className="otp-back-btn"
                  onClick={handleBackToForm}
                >
                  <ArrowLeft size={16} />
                  Back to form
                </button>
              </div>
            </form>
          )}

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
