import { useEffect, useMemo, useState } from "react";

export default function ExerciseSelect({ onSelect }) {
  const [group, setGroup] = useState("Chest");
  const [allExercises, setAllExercises] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/exercises")
      .then((res) => res.json())
      .then((data) => setAllExercises(data))
      .catch((err) => console.log(err));
  }, []);

  const groups = [
    "Chest",
    "Back",
    "Shoulders",
    "Biceps",
    "Triceps",
    "Legs",
    "Abs"
  ];

  const filteredExercises = useMemo(() => {
    return allExercises.filter((ex) => {
      const sameGroup = ex.category === group;

      const matchesSearch = ex.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return sameGroup && matchesSearch;
    });
  }, [allExercises, group, search]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        marginBottom: "15px",
        width: "100%"
      }}
    >
      
      <div>
        <label
          style={{
            color: "white",
            fontWeight: "600",
            marginBottom: "6px",
            display: "block",
            fontSize: "15px"
          }}
        >
          Body Part
        </label>

        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "18px",
            background: "#1e293b",
            color: "white",
            border: "1px solid #475569",
            outline: "none",
            fontSize: "16px",
            fontWeight: "500"
          }}
        >
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      
      <div>
        <label
          style={{
            color: "white",
            fontWeight: "600",
            marginBottom: "6px",
            display: "block",
            fontSize: "15px"
          }}
        >
          Search Exercise
        </label>

        <input
          type="text"
          placeholder="Pretraži vježbu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "18px",
            background: "#1e293b",
            color: "white",
            border: "1px solid #475569",
            outline: "none",
            fontSize: "16px"
          }}
        />
      </div>

     
      <div>
        <label
          style={{
            color: "white",
            fontWeight: "600",
            marginBottom: "6px",
            display: "block",
            fontSize: "15px"
          }}
        >
          Exercise
        </label>

        <select
          onChange={(e) => onSelect(e.target.value)}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "18px",
            background: "#1e293b",
            color: "white",
            border: "1px solid #475569",
            outline: "none",
            fontSize: "16px",
            fontWeight: "500"
          }}
        >
          <option>Odaberi vježbu</option>

          {filteredExercises.map((ex) => (
            <option key={ex._id} value={ex.name}>
              {ex.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}