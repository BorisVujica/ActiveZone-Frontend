export default function useStreak(workouts) {
  const days = Object.keys(workouts || {}).sort();

  if (days.length === 0) {
    return { streak: 0, restMessage: null };
  }

  let streak = 1;

  for (let i = days.length - 1; i > 0; i--) {
    const curr = new Date(days[i]);
    const prev = new Date(days[i - 1]);

    const diff =
      (curr - prev) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  let restMessage = null;

  if (streak >= 5) {
    restMessage = "🧠 Razmisli o laganom rest dayu sutra";
  } else if (days.length >= 3) {
    const last = new Date(days.at(-1));
    const today = new Date();
    const gap =
      (today - last) / (1000 * 60 * 60 * 24);

    if (gap >= 3) {
      restMessage = "😴 Vrijeme za lagani oporavak";
    }
  }

  return { streak, restMessage };
}
