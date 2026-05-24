export default function BMIGauge({ bmi }) {
  if (bmi === null || bmi === undefined) return null;

  
  const value = Math.min(40, Math.max(0, bmi));

 
  const angle = (value / 40) * 180 - 90;

  const getStatus = () => {
    if (value < 18.5) return "Underweight";
    if (value < 25) return "Normal";
    if (value < 30) return "Overweight";
    return "Obese";
  };

  return (
    <div className="bmi-gauge">
      <svg viewBox="0 0 200 130" width="240">
        
        <defs>
          <linearGradient id="bmiGradient">
            <stop offset="0%" stopColor="#4caf50" />
            <stop offset="50%" stopColor="#ffeb3b" />
            <stop offset="75%" stopColor="#ff9800" />
            <stop offset="100%" stopColor="#e53935" />
          </linearGradient>
        </defs>

        
        <path
          d="M10 110 A90 90 0 0 1 190 110"
          fill="none"
          stroke="url(#bmiGradient)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: "100px 110px",
            transition: "transform 0.8s cubic-bezier(.4,1.4,.6,1)"
          }}
        >
          <line
            x1="100"
            y1="110"
            x2="100"
            y2="30"
            stroke="#04141c"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="100" cy="110" r="6" fill="#04141c" />
        </g>

        
        <text x="6" y="124" fontSize="12" fill="#04141c">0</text>
        <text x="36" y="52" fontSize="12" fill="#04141c">18.5</text>
        <text x="92" y="20" fontSize="12" fill="#04141c">25</text>
        <text x="150" y="52" fontSize="12" fill="#04141c">30</text>
        <text x="172" y="124" fontSize="12" fill="#04141c">40</text>
      </svg>

      
      <div className={`bmi-status ${getStatus().toLowerCase()}`}>
        {getStatus()}
      </div>
    </div>
  );
}
