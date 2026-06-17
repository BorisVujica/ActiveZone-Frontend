import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "../styles/navbar.css";

export default function Navbar() {
  const { logout } = useAuth();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);

  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);

  const [alarmActive, setAlarmActive] = useState(false);
  const [alarmOverlay, setAlarmOverlay] = useState(false);

  const dropdownRef = useRef(null);
  const alarmIntervalRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setOpen(false);
    setTimerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
        setTimerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleMinutesChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setMinutes(value);
    }
  };

  const handleSecondsChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setSeconds(value);
    }
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const playAlarm = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    const ctx = audioContextRef.current;

    alarmIntervalRef.current = setInterval(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = 900;
      gain.gain.value = 0.3;

      osc.start();
      setTimeout(() => osc.stop(), 300);
    }, 500);

    if (navigator.vibrate) {
      navigator.vibrate([500, 300, 500]);
    }

    setAlarmActive(true);
    setAlarmOverlay(true);
  };

  const stopAlarm = () => {
    clearInterval(alarmIntervalRef.current);
    if (navigator.vibrate) navigator.vibrate(0);
    setAlarmActive(false);
    setAlarmOverlay(false);
  };

  const startTimer = () => {
    const totalSeconds =
      Number(minutes || 0) * 60 + Number(seconds || 0);
    setTimeLeft(totalSeconds);
    setRunning(true);
  };

  const pauseTimer = () => setRunning(false);

  const resetTimer = () => {
    setRunning(false);
    setTimeLeft(0);
    stopAlarm();
  };

  useEffect(() => {
    let interval;

    if (running && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((p) => p - 1);
      }, 1000);
    }

    if (timeLeft === 0 && running) {
      setRunning(false);
      playAlarm();
    }

    return () => clearInterval(interval);
  }, [running, timeLeft]);

  return (
    <>
      <header className="top-nav" ref={dropdownRef}>
        <div className="nav-left">
          <img src={logo} alt="ActiveZone" className="logo" />

          <div className="timer-wrapper">
            <span
              className={`timer-icon ${running ? "timer-icon-active" : ""}`}
              onClick={() => setTimerOpen((p) => !p)}
            >
              ⏱
              {running && <span className="timer-badge" />}
            </span>

            {timerOpen && (
              <>
                <div
                  className="mobile-menu-backdrop"
                  onClick={() => setTimerOpen(false)}
                />

                <div className="timer-popup">
                  <div className="timer-inputs">
                    <input
                      type="number"
                      min="0"
                      value={minutes}
                      onChange={handleMinutesChange}
                      placeholder="min"
                    />
                    <span>:</span>
                    <input
                      type="number"
                      min="0"
                      value={seconds}
                      onChange={handleSecondsChange}
                      placeholder="sec"
                    />
                  </div>

                  <div className="timer-display">
                    {formatTime(timeLeft)}
                  </div>

                  <div className="timer-buttons">
                    <button onClick={startTimer}>Start</button>
                    <button onClick={pauseTimer}>Pause</button>
                    <button onClick={resetTimer}>Reset</button>

                    {alarmActive && (
                      <button className="stop-alarm" onClick={stopAlarm}>
                        Stop
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      <nav className="nav-links">
        <NavLink to="/dashboard">🏠Dashboard</NavLink>

        <NavLink to="/bmi">📏BMI</NavLink>

        <NavLink to="/about">ℹ️About</NavLink>

        <NavLink to="/security" className="security-link">
         <span className="security-icon">🔐</span>
         Security
        </NavLink>

        <button className="logout" onClick={logout}>
          ⎋ Logout
        </button>
      </nav>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            onClick={() => setDark(!dark)}
          >
            {dark ? "☀" : "🌙"}
          </button>

          <button
            className="menu-btn"
            onClick={() => setOpen((p) => !p)}
          >
            ☰
          </button>
        </div>

       {open && (
        <>
          <div
            className="mobile-menu-backdrop"
            onClick={() => setOpen(false)}
          />

          <div className="dropdown">
           <NavLink to="/dashboard">
             <span className="nav-icon">🏠</span>
             <span>Dashboard</span>
           </NavLink>

           <NavLink to="/bmi">
             <span className="nav-icon">📏</span>
             <span>BMI</span>
           </NavLink>

           <NavLink to="/about">
             <span className="nav-icon">ℹ️</span>
             <span>About</span>
           </NavLink>

           <NavLink to="/security" className="security-link">
            <span className="nav-icon">🔐</span>
            <span>Security</span>
           </NavLink>

           <button onClick={logout}>
             <span className="nav-icon">⎋</span>
             <span>Logout</span>
          </button>
    </div>
        </>
)}
      </header>

      {alarmOverlay && (
        <div className="alarm-overlay">
          <div className="alarm-box">
            <h1>⏰ ALARM!</h1>
            <p>Time is up</p>
            <button onClick={stopAlarm}>STOP</button>
          </div>
        </div>
      )}
    </>
  );
}