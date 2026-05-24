import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/monthlyCalendar.css";


const toLocalDateString = date => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function MonthlyCalendar({ workouts, onSelectDay }) {
  return (
    <div className="monthly-calendar">
      <Calendar
        onClickDay={date => onSelectDay(toLocalDateString(date))}
        tileContent={({ date }) => {
          const day = toLocalDateString(date);
          const dayWorkouts = workouts?.[day];

          if (!dayWorkouts) return null;

          const totalCalories = dayWorkouts.reduce(
            (sum, w) => sum + (w.calories || 0),
            0
          );

          return (
            <div className="day-marker">
              ✓
              <div className="hover-preview">
                <strong>
                  📊 {dayWorkouts.length} vježbe – {totalCalories} kcal
                </strong>

                <div className="hover-scroll">
                  {dayWorkouts.map((w, i) => (
                    <div key={i} className="hover-item">
                      • {w.exercise} ({w.calories} kcal)
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
