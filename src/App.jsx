import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import BMICalculator from "./pages/BMICalculator";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Security from "./pages/Security";
import { Toaster } from "react-hot-toast";

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/register";

  return (
    <> 
      <Toaster
        position="top-right"
         toastOptions={{
          duration: 2500,
          style: {
             background: "var(--bg-card)",
             color: "var(--text-main)",
             borderRadius: "14px",
             border: "1px solid rgba(255,255,255,0.08)",
             boxShadow: "0 10px 28px rgba(0,0,0,.35)",
          },
        }}
    />

      {!hideNavbar && <Navbar />}

      <div className={hideNavbar ? "auth-layout" : "app-layout"}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bmi"
            element={
              <ProtectedRoute>
                <BMICalculator />
              </ProtectedRoute>
            }
          />

          <Route path="/about" element={<About />} />
        
         <Route
          path="/security"
          element={
           <ProtectedRoute>
            <Security />
           </ProtectedRoute>
  }
/>
        </Routes>
      </div>
    </>
  );
}

export default App;