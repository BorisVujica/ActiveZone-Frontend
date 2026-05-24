import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const ok = await auth.login(email, password);
    if (ok) navigate("/dashboard");
    else alert("Neispravni podaci");
  };

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <img src={logo} alt="Logo" />
      </div>

      <div className="auth-card">
        <h1>Prijava</h1>
        <p className="auth-subtitle">Prijavi se na svoj račun</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-field">
            <input
              type={show ? "text" : "password"}
              placeholder="Lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShow(!show)}
            >
              {show ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit">Login</button>
        </form>

        <div className="auth-footer">
          Nemaš račun?{" "}
          <a onClick={() => navigate("/register")}>Registracija</a>
        </div>
      </div>
    </div>
  );
}
