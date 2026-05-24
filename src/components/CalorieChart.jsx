import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

const toLocalDateString = date => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

function getWeekStart(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return d;
}

export default function CalorieChart({ workouts, selectedDay }) {
  if (!selectedDay) return null;

  const weekStart = getWeekStart(selectedDay);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const caloriesByDay = days.map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const key = toLocalDateString(d);

    return (workouts[key] || []).reduce(
      (sum, w) => sum + (w.calories || 0),
      0
    );
  });

  const data = {
    labels: days,
    datasets: [
      {
        label: "Kalorije",
        data: caloriesByDay,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        borderColor: "#4ade80",
        backgroundColor: "rgba(74,222,128,0.25)"
      }
    ]
  };

  return (
    <div style={{ height: 260 }}>
      <Line data={data} options={{ responsive: true }} />
    </div>
  );
}
