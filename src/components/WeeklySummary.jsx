

export default function WeeklySummary({ streak, showActiveRestHint }) {
  return (
    <div className="card weekly-summary">
      <h3>📊 Trenutni streak</h3>

      {streak > 0 ? (
        <p className="streak-text">
          🔥 <strong>{streak}-day streak</strong>
        </p>
      ) : (
        <p className="streak-text muted">
          Započni novi streak 💪
        </p>
      )}

      {showActiveRestHint && (
        <div className="rest-hint">
          🧠 <strong>{streak} dana zaredom</strong><br />
          Razmisli o laganom rest dayu sutra
        </div>
      )}
    </div>
  );
}
