import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/security.css";
import toast from "react-hot-toast";

export default function Security() {
  const [phone, setPhone] = useState("");
  const [network, setNetwork] = useState("5g");

  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);

  useEffect(() => {
    fetchPhone();
  }, []);

  const fetchPhone = async () => {
    try {
      const res = await api.get("/security/phone");

      if (res.data.phone) {
        setPhone(res.data.phone);
        setSaved(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const savePhone = async () => {
    const cleanedPhone = phone.replace(/\s+/g, "");

    if (!cleanedPhone.startsWith("+385")) {
      toast.error("Number must start with +385.");
      return;
    }

    const digitsOnly = cleanedPhone.replace(/^\+/, "");

    if (!/^\d+$/.test(digitsOnly)) {
      toast.error("Phone number can contain only digits.");
      return;
    }

    if (digitsOnly.length !== 13) {
      toast.error("Invalid number must have 13 digits. Example: +3859123456789");
      return;
    }

    try {
      await api.put("/security/phone", {
        phone: cleanedPhone,
      });

      setPhone(cleanedPhone);
      setSaved(true);
      toast.success("Phone number saved.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save number.");
    }
  };

  const runCheck = async () => {
    try {
      setLoading(true);
      setResult(null);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await api.post("/security/check", {
        network,
      });

      if (response.data.error) {
        toast.error(response.data.message || "Security check failed.");
      } else if (response.data.risk === "HIGH") {
        toast.error("High risk detected!");
      } else {
        toast.success("Security check completed.");
      }

      setResult(response.data);
      setLastCheck(new Date().toLocaleString("hr-HR"));
    } catch (err) {
      console.error(err);
      toast.error("Security check failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-container">
        <div className="card security-card">
          <h2>🛡 Security Center</h2>

          {!saved ? (
            <>
              <p>No phone number saved.</p>

              <input
                className="security-input"
                type="text"
                placeholder="+385..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <button
                className="add-btn"
                onClick={savePhone}
                disabled={!phone}
              >
                Save Number
              </button>
            </>
          ) : (
            <>
              <div className="phone-header">
                <p>
                  <strong>Phone Number:</strong> {phone}
                </p>

                <button
                  className="change-number-btn"
                  onClick={() => {
                    setSaved(false);
                    setResult(null);
                    setLastCheck(null);
                  }}
                >
                  ✏ Change Number
                </button>
              </div>

              <div className="select-wrapper">
                <label className="input-label">
                  Connection Type
                </label>

                <select
                  className="styled-select"
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                >
                  <option value="wifi">📶 Wi-Fi</option>
                  <option value="4g">📱 4G</option>
                  <option value="5g">🚀 5G</option>
                </select>
              </div>

              <button
                className="add-btn"
                onClick={runCheck}
                disabled={loading}
              >
                {loading
                  ? "Checking..."
                  : "Run CAMARA Security Check"}
              </button>

              {result && (
                <div className="security-result">
                  {result.error ? (
                    <>
                      <p>⚠ {result.message}</p>
                    </>
                  ) : (
                    <>
                      <p>
                        ✓ Number Verification Passed
                      </p>

                      <p>
                        {result.simSwapDetected
                          ? "⚠ SIM Swap Detected"
                          : "✓ SIM Swap Check Passed"}
                      </p>

                      <p>
                        <strong>
                          Risk Level: {result.risk}
                        </strong>
                      </p>

                      {result.risk === "HIGH" && (
                        <p>
                          Account Temporarily Locked
                        </p>
                      )}
                    </>
                  )}

                  {lastCheck && (
                    <p
                      style={{
                        marginTop: "12px",
                        opacity: 0.8,
                        fontSize: "14px",
                      }}
                    >
                      Last security check:
                      <br />
                      {lastCheck}
                    </p>
                  )}

                  <small>
                    CAMARA Open Gateway (Demonstration Mode)
                  </small>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}