const messages = [
  "Svaki trening je korak bliže cilju 💪",
  "Disciplina je jača od motivacije.",
  "Zdravlje je najveće bogatstvo.",
  "Ne odustaj – rezultat dolazi."
];

export default function MotivationText() {
  const message =
    messages[Math.floor(Math.random() * messages.length)];

  return <p style={{ marginTop: "15px" }}>{message}</p>;
}
//ne sluzi nicemu trenutno