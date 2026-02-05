import { useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock delay for animation feel
    setTimeout(() => {
      sessionStorage.setItem("authToken", "token");
      sessionStorage.setItem("user", username || "User");
      localStorage.setItem("zatchat-user-id", "2ca5bc67-b822-4a0a-ba8b-ec60038b4ea7");
      localStorage.setItem("company-id", "192d1bcd-f196-4a85-b4ed-bb64a34e93ca");
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="login-container">
      {/* Dynamic Animated Background */}
      <div className="animated-bg">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="login-card-wrapper">
        <div className="login-card">
          <div className="brand-header">
            <div className="logo-icon">Z</div>
            <span className="brand-name">Zat Room</span>
          </div>

          <div className="text-header">
            <h2>Welcome back</h2>
            <p>Enter your credentials to access your secure meeting room.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="actions-row">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="custom-checkbox"></span>
                Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? <span className="loader"></span> : "Sign in to Dashboard"}
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <button type="button" className="btn-google">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="google" width="18"/>
              Sign in with Google
            </button>
          </form>

          <div className="bottom-text">
            Don't have an account? <a href="#">Create an account</a>
          </div>
        </div>
        
        <div className="legal-footer-centered">
          © 2024 Zat Room Enterprise. Secure End-to-End Encrypted.
        </div>
      </div>
    </div>
  );
}