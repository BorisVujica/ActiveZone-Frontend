import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/security.css";

export default function Security() {
  const [phone, setPhone] = useState("");
  const [network, setNetwork] = useState("5g");

  const [saved, setSaved] = useState(false);

  const [result, setResult] = useState(null);

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
    try {
      await api.put("/security/phone", {
        phone,
      });

      setSaved(true);
      alert("Phone number saved.");
    } catch (err) {
      console.error(err);
    }
  };

  const runCheck = async () => {
    try {
      const res = await api.post("/security/check", {
        network,
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
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
              >
                Run CAMARA Security Check
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