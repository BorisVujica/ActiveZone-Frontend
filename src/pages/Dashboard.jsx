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
  const [customExercises, setCustomExercises] = useState([]);

  const [customSearch, setCustomSearch] = useState("");

  const [calories, setCalories] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const [showPRPopup, setShowPRPopup] = useState(false);
  const [prExercise, setPrExercise] = useState("");

  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseCategory, setNewExerciseCategory] = useState("Chest");

  
  const deleteCustomExercise = async (id) => {
    await api.delete(`/exercises/${id}`);

    setCustomExercises(prev => prev.filter(ex => ex._id !== id));
    setAllExercises(prev => prev.filter(ex => ex._id !== id));
  };

  
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
      setCustomExercises(res.data.filter(ex => ex.isCustom));
    };

    fetchExercises();
  }, []);

  const filteredExercises = allExercises.filter(ex => {
    const categoryMatch = ex.category?.toLowerCase() === group.toLowerCase();
    const searchMatch = ex.name?.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const { streak, showActiveRestHint } = useStreak(workouts);

  const launchConfetti = () => {
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });

    setTimeout(() => {
      confetti({ particleCount: 100, spread: 120, origin: { y: 0.5 } });
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

  const addCustomExercise = async () => {
    if (!newExerciseName || !newExerciseCategory) return;

    const res = await api.post("/exercises", {
      name: newExerciseName,
      category: newExerciseCategory
    });

    setAllExercises(prev => [...prev, res.data]);
    setCustomExercises(prev => [...prev, res.data]);

    setNewExerciseName("");
    setNewExerciseCategory("Chest");
    setShowAddExercise(false);
  };

  const deleteWorkout = async id => {
    await api.delete(`/workouts/${id}`);

    setWorkouts(prev => {
      const updatedDay = prev[selectedDay].filter(w => w._id !== id);

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
            <p className="pr-empty">Još nema PR-ova</p>
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
                    <div>{w.sets}×{w.reps} @ {w.weight}kg</div>
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
              <label className="input-label">💪 Body Part</label>

              <select
                className="styled-select"
                value={group}
                onChange={e => {
                  setGroup(e.target.value);
                  setExercise("");
                  setSearch("");
                }}
              >
                <option value="Chest">Chest</option>
                <option value="Back">Back</option>
                <option value="Shoulders">Shoulders</option>
                <option value="Biceps">Biceps</option>
                <option value="Triceps">Triceps</option>
                <option value="Legs">Legs</option>
                <option value="Abs">Abs</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="🔍 Pretraži..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <div className="select-wrapper">
              <label className="input-label">🏋️ Exercise</label>

              <select
                className="styled-select"
                value={exercise}
                onChange={e => setExercise(e.target.value)}
              >
                <option value="">Odaberi</option>

                {filteredExercises.map(ex => (
                  <option key={ex._id} value={ex.name}>
                    {ex.name}
                  </option>
                ))}
              </select>

              <button
                className="add-btn"
                style={{ marginTop: 10 }}
                onClick={() => setShowAddExercise(true)}
              >
                + Dodaj novu vježbu
              </button>
            </div>

            <div className="input-row">
              <input type="number" placeholder="Sets" value={sets} onChange={e => setSets(e.target.value)} />
              <input type="number" placeholder="Reps" value={reps} onChange={e => setReps(e.target.value)} />
            </div>

            <input type="number" placeholder="Weight" value={weight} onChange={e => setWeight(e.target.value)} />
            <input type="number" placeholder="Calories" value={calories} onChange={e => setCalories(e.target.value)} />

            <div className="modal-actions">
              <button
                className="add-btn"
                disabled={!exercise || !sets || !reps || !weight}
                onClick={addWorkout}
              >
                Dodaj
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

      
      {showAddExercise && (
        <div className="modal-backdrop">
          <div className="modal">

            <h3>➕ Nova vježba</h3>

            <input
              placeholder="Ime vježbe"
              value={newExerciseName}
              onChange={e => setNewExerciseName(e.target.value)}
            />

            <select
              className="styled-select"
              value={newExerciseCategory}
              onChange={e => setNewExerciseCategory(e.target.value)}
            >
              <option value="Chest">Chest</option>
              <option value="Back">Back</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Biceps">Biceps</option>
              <option value="Triceps">Triceps</option>
              <option value="Legs">Legs</option>
              <option value="Abs">Abs</option>
            </select>

            <div className="modal-actions">
              <button className="add-btn" onClick={addCustomExercise}>
                Spremi
              </button>

              <button className="close-btn" onClick={() => setShowAddExercise(false)}>
                Zatvori
              </button>
            </div>

            
            <div style={{ marginTop: 12 }}>
              <input
                type="text"
                placeholder="🔍 Filter custom vježbi"
                value={customSearch}
                onChange={(e) => setCustomSearch(e.target.value)}
              />
            </div>

            <div className="workout-list" style={{ maxHeight: 160, marginTop: 12 }}>
              {customExercises
                .filter(ex =>
                  ex.name.toLowerCase().includes(customSearch.toLowerCase())
                )
                .map(ex => (
                  <div key={ex._id} className="workout-item">
                    <div className="workout-info">
                      <strong>{ex.name}</strong>
                      <div style={{ opacity: 0.7, fontSize: 12 }}>
                        {ex.category}
                      </div>
                    </div>

                    <button
                      className="delete-btn"
                      onClick={() => deleteCustomExercise(ex._id)}
                    >
                      ✖
                    </button>
                  </div>
                ))}
            </div>

          </div>
        </div>
      )}

      
      {showPRPopup && (
        <div className="modal-backdrop">
          <div className="modal pr-popup">
            <h2>🎉 Congrats!</h2>
            <p>New PR in <strong>{prExercise}</strong></p>

            <button className="add-btn" onClick={() => setShowPRPopup(false)}>
              Awesome
            </button>
          </div>
        </div>
      )}

    </div>
  );
}