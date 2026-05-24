import { useState, useEffect } from "react";
import MonthlyCalendar from "../components/MonthlyCalendar";
import CalorieChart from "../components/CalorieChart";
import WeeklySummary from "../components/WeeklySummary";
import useStreak from "../Hooks/useStreak";
import "../styles/dashboard.css";
import api from "../api/api";
import confetti from "canvas-confetti";

export default function Dashboard() {

  const [workouts, setWorkouts] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [exercise, setExercise] = useState("");
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("Chest");

  const [allExercises, setAllExercises] = useState([]);

  const [calories, setCalories] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const [showPRPopup, setShowPRPopup] = useState(false);
  const [prExercise, setPrExercise] = useState("");

  

  useEffect(() => {

    const now = new Date();

    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");

    setSelectedDay(`${y}-${m}-${d}`);

  }, []);

 

  useEffect(() => {

    const fetchWorkouts = async () => {

      const res = await api.get("/workouts");

      const grouped = {};

      res.data.forEach(w => {

        if (!grouped[w.day]) grouped[w.day] = [];

        grouped[w.day].push(w);

      });

      setWorkouts(grouped);

    };

    fetchWorkouts();

  }, []);

  

  useEffect(() => {

    const fetchExercises = async () => {

      const res = await api.get("/exercises");

      setAllExercises(res.data);

    };

    fetchExercises();

  }, []);

  

  const filteredExercises = allExercises.filter(ex => {

    const categoryMatch =
      ex.category?.toLowerCase() === group.toLowerCase();

    const searchMatch =
      ex.name?.toLowerCase().includes(search.toLowerCase());

    return categoryMatch && searchMatch;

  });

  

  const { streak, showActiveRestHint } = useStreak(workouts);

  

  const launchConfetti = () => {

    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 }
    });

    setTimeout(() => {

      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.5 }
      });

    }, 250);

  };

  

  const calcScore = w => w.weight * w.sets * w.reps;

  const isNewPR = (exerciseName, current) => {

    const all = Object.values(workouts)
      .flat()
      .filter(w => w.exercise === exerciseName);

    if (all.length === 0) return true;

    const best = all.reduce((max, w) =>
      calcScore(w) > calcScore(max) ? w : max
    );

    return calcScore(current) > calcScore(best);

  };

  const getPRHistory = () => {

    const history = {};

    Object.values(workouts).flat().forEach(w => {

      if (!history[w.exercise]) history[w.exercise] = [];

      const best = history[w.exercise].at(-1);

      if (!best || calcScore(w) > calcScore(best)) {
        history[w.exercise].push(w);
      }

    });

    return history;

  };

  const prHistory = getPRHistory();

  

  const addWorkout = async () => {

    const workoutData = {

      day: selectedDay,
      exercise,

      calories: calories ? Number(calories) : 0,

      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight)

    };

    const res = await api.post("/workouts", workoutData);

    if (isNewPR(exercise, workoutData)) {

      setPrExercise(exercise);
      setShowPRPopup(true);

      launchConfetti();

    }

    setWorkouts(prev => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), res.data]
    }));

    setExercise("");
    setSearch("");
    setCalories("");
    setSets("");
    setReps("");
    setWeight("");

  };

  

  const deleteWorkout = async id => {

    await api.delete(`/workouts/${id}`);

    setWorkouts(prev => {

      const updatedDay = prev[selectedDay].filter(
        w => w._id !== id
      );

      if (updatedDay.length === 0) {

        const copy = { ...prev };

        delete copy[selectedDay];

        return copy;

      }

      return {
        ...prev,
        [selectedDay]: updatedDay
      };

    });

  };

  return (

    <div className="dashboard-page">

      <div className="page-container">

        <h2>Dashboard</h2>

        <div className="dashboard-grid">

          <div className="card">

            <h3>Kalendar treninga</h3>

            <MonthlyCalendar
              workouts={workouts}
              onSelectDay={day => {
                setSelectedDay(day);
                setIsModalOpen(true);
              }}
            />

          </div>

          <div className="card">

            <h3>
              {selectedDay
                ? `Tjedne kalorije (${selectedDay})`
                : "Tjedne kalorije"}
            </h3>

            <CalorieChart
              workouts={workouts}
              selectedDay={selectedDay}
            />

          </div>

        </div>

        <WeeklySummary
          streak={streak}
          showActiveRestHint={showActiveRestHint}
        />

        <div className="card pr-card">

          <h3>🏆 Personal Records</h3>

          {Object.keys(prHistory).length === 0 && (
            <p className="pr-empty">
              Još nema PR-ova
            </p>
          )}

          <div className="pr-grid">

            {Object.entries(prHistory).map(([exercise, records]) => (

              <div key={exercise} className="pr-group">

                <strong>🏋️ {exercise}</strong>

                {records.map((r, i) => (

                  <div key={i} className="pr-item">
                    {r.weight}kg · {r.sets}×{r.reps}
                  </div>

                ))}

              </div>

            ))}

          </div>

        </div>

      </div>

      

      {isModalOpen && selectedDay && (

        <div className="modal-backdrop">

          <div className="modal">

            <h3>{selectedDay}</h3>

            <div className="workout-list">

              {(workouts[selectedDay] || []).map(w => (

                <div key={w._id} className="workout-item">

                  <div className="workout-info">

                    <strong>{w.exercise}</strong>

                    <div>
                      {w.sets}×{w.reps} @ {w.weight}kg • {w.calories} kcal
                    </div>

                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => deleteWorkout(w._id)}
                  >
                    ✖
                  </button>

                </div>

              ))}

            </div>

            

            <div className="select-wrapper">

              <label className="input-label">
                💪 Body Part
              </label>

              <select
                className="styled-select"
                value={group}
                onChange={e => {
                  setGroup(e.target.value);
                  setExercise("");
                  setSearch("");
                }}
              >

                <option value="Chest">🦍 Chest</option>
                <option value="Back">🧗 Back</option>
                <option value="Shoulders">🏔️ Shoulders</option>
                <option value="Biceps">💪 Biceps</option>
                <option value="Triceps">⚡ Triceps</option>
                <option value="Legs">🦵 Legs</option>
                <option value="Abs">🧱 Abs</option>

              </select>

            </div>

           

            <input
              type="text"
              placeholder="🔍 Pretraži vježbu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            

            <div className="select-wrapper">

              <label className="input-label">
                🏋️ Exercise
              </label>

              <select
                className="styled-select"
                value={exercise}
                onChange={e => setExercise(e.target.value)}
              >

                <option value="">
                  Odaberi vježbu
                </option>

                {filteredExercises.map(ex => (

                  <option
                    key={ex._id}
                    value={ex.name}
                  >
                    {ex.name}
                  </option>

                ))}

              </select>

            </div>

            <div className="input-row">

              <input
                type="number"
                placeholder="Setovi"
                value={sets}
                onChange={e => setSets(e.target.value)}
              />

              <input
                type="number"
                placeholder="Repovi"
                value={reps}
                onChange={e => setReps(e.target.value)}
              />

            </div>

            <input
              type="number"
              placeholder="Težina (kg)"
              value={weight}
              onChange={e => setWeight(e.target.value)}
            />

            <input
              type="number"
              placeholder="Kalorije (opcionalno)"
              value={calories}
              onChange={e => setCalories(e.target.value)}
            />

            <div className="modal-actions">

              <button
                className="add-btn"
                disabled={!exercise || !sets || !reps || !weight}
                onClick={addWorkout}
              >
                Dodaj vježbu
              </button>

              <button
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                Zatvori
              </button>

            </div>

          </div>

        </div>

      )}

      {showPRPopup && (

        <div className="modal-backdrop">

          <div className="modal pr-popup">

            <h2>🎉 Congrats!</h2>

            <p>
              New personal record in <strong>{prExercise}</strong>
            </p>

            <button
              className="add-btn"
              onClick={() => setShowPRPopup(false)}
            >
              🔥 Awesome!
            </button>

          </div>

        </div>

      )}

    </div>

  );

}