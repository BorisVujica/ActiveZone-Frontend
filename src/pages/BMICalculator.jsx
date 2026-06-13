import { useState } from "react";
import BMIGauge from "../components/BMIGauge";
import "../styles/bmi.css";

export default function BMICalculator() {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const bmi =
    weight && height
      ? (weight / ((height / 100) ** 2)).toFixed(1)
      : null;

  return (
    <>
      
      <div className="open-bmi-wrapper">
        <button className="open-btn" onClick={() => setOpen(true)}>
          Open BMI calculator
        </button>

      </div>

      
      {open && (
        <div className="bmi-backdrop" onClick={() => setOpen(false)}>
          <div
            className="bmi-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>BMI Calculator</h2>

            <div className="bmi-inputs">
  <input
    type="number"
    placeholder="Težina (kg)"
    value={weight}
    onChange={(e) => setWeight(e.target.value)}
  />

  <input
    type="number"
    placeholder="Visina (cm)"
    value={height}
    onChange={(e) => setHeight(e.target.value)}
  />
</div>


    {bmi && (
     <>
      <BMIGauge bmi={Number(bmi)} />

       <div className="bmi-result">
          <strong>{bmi}</strong>
       </div>
     </>
     )}

     <button
       className="close-btn"
        onClick={() => setOpen(false)}
      >
        Close
      </button>
    </div>
  </div>
      )}
    </>
  );
}
