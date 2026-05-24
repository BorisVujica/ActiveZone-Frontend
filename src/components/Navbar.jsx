import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "../styles/navbar.css";

export default function Navbar() {
  const { logout } = useAuth();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const dropdownRef = useRef(null);

  // Tema (Light/Dark mode)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // Zatvori dropdown ako se ekran raširi iznad mobilne rezolucije
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Zatvori dropdown automatski pri promjeni rute
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Zatvaranje na klik izvan dropdowna ili gumba
  useEffect(() => {
    const handleClickOutside = e => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  return (
    <header className="top-nav" ref={dropdownRef}>
      <div className="nav-left">
        <img src={logo} alt="ActiveZone" className="logo" />
      </div>

      {/* Desktop navigacija */}
      <nav className="nav-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/bmi">BMI</NavLink>
        <NavLink to="/about">About</NavLink>

        <button className="logout" onClick={logout}>
          <span className="logout-icon">⎋</span>
          Logout
        </button>
      </nav>

      {/* Kontrole s desne strane */}
      <div className="nav-actions">
        <button
          className="theme-toggle"
          onClick={() => setDark(!dark)}
        >
          {dark ? "☀" : "🌙"}
        </button>

        <button
          className="menu-btn"
          onClick={() => setOpen(prev => !prev)}
        >
          ☰
        </button>
      </div>

      {/* Dropdown postavljen izvan svih flex kontejnera s fiksnom pozicijom */}
      {open && (
        <div className="dropdown">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/bmi">BMI</NavLink>
          <NavLink to="/about">About</NavLink>
          <button onClick={logout} className="dropdown-logout-btn">
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
