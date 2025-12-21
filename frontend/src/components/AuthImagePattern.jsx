import "./AuthImagePattern.css";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="auth-pattern-container">
      <div className="auth-pattern-content">
        <div className="auth-pattern-grid">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`auth-pattern-block ${
                i % 2 === 0 ? "auth-pattern-block-pulse" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="auth-pattern-title">{title}</h2>
        <p className="auth-pattern-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
