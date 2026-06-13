import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "../styles/auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const ok = await auth.register(email, password);
    if (ok) navigate("/");
    else alert("Greška pri registraciji");
  };

  return (
    <div className="auth-page">
      
      <div className="auth-logo">
        <img src={logo} alt="Logo" />
      </div>

      <div className="auth-card">
        <h1>Registracija</h1>
        <p className="auth-subtitle">Kreiraj novi račun</p>

        <form onSubmit={handleRegister}>
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

          <button type="submit">Register</button>
        </form>

        <div className="auth-footer">
          Već imaš račun?{" "}
          <a onClick={() => navigate("/")}>Login</a>
        </div>
      </div>
    </div>
  );
}
