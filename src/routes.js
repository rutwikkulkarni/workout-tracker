const express = require("express");
const router = express.Router();
const db = require("./database");

// ─── Settings ───
router.get("/settings", (req, res) => {
  res.json(db.getAllSettings());
});

router.put("/settings/:key", (req, res) => {
  const { value } = req.body;
  db.setSetting(req.params.key, value);
  res.json({ ok: true });
});

// ─── Workouts ───
router.get("/workouts", (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;
  res.json(db.getWorkoutHistory(limit, offset));
});

router.post("/workouts", (req, res) => {
  const { day_key, day_name } = req.body;
  const id = db.startWorkout(day_key, day_name);
  res.json({ id: Number(id) });
});

router.get("/workouts/:id", (req, res) => {
  const workout = db.getWorkout(parseInt(req.params.id));
  if (!workout) return res.status(404).json({ error: "Not found" });
  res.json(workout);
});

router.put("/workouts/:id/finish", (req, res) => {
  const { completed_sets, total_sets, notes } = req.body;
  db.finishWorkout(parseInt(req.params.id), completed_sets, total_sets, notes);
  res.json({ ok: true });
});

router.delete("/workouts/:id", (req, res) => {
  db.deleteWorkout(parseInt(req.params.id));
  res.json({ ok: true });
});

// ─── Sets ───
router.post("/workouts/:id/sets", (req, res) => {
  const workoutId = parseInt(req.params.id);
  const { sets } = req.body; // Array of set objects
  db.saveSets(workoutId, sets);
  res.json({ ok: true });
});

// ─── PRs ───
router.get("/prs", (req, res) => {
  res.json(db.getAllPRs());
});

router.get("/prs/:exerciseId", (req, res) => {
  res.json(db.getExercisePRs(req.params.exerciseId));
});

router.post("/prs", (req, res) => {
  const { exercise_id, exercise_name, weight, reps } = req.body;
  db.checkAndSavePR(exercise_id, exercise_name, weight, reps);
  res.json({ ok: true });
});

// ─── Stats ───
router.get("/stats/exercise/:exerciseId", (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  res.json(db.getExerciseHistory(req.params.exerciseId, limit));
});

router.get("/stats/volume", (req, res) => {
  const weeks = parseInt(req.query.weeks) || 8;
  res.json(db.getWeeklyVolume(weeks));
});

// ─── Export/Import ───
router.get("/export", (req, res) => {
  const data = {
    exported_at: new Date().toISOString(),
    settings: db.getAllSettings(),
    workouts: db.getWorkoutHistory(9999, 0).map(w => ({
      ...w,
      sets: db.getDb().prepare("SELECT * FROM workout_sets WHERE workout_id = ?").all(w.id),
    })),
    prs: db.getAllPRs(),
  };
  res.setHeader("Content-Disposition", "attachment; filename=workout-backup.json");
  res.json(data);
});

router.post("/import", (req, res) => {
  try {
    const data = req.body;
    const d = db.getDb();

    const tx = d.transaction(() => {
      // Import settings
      if (data.settings) {
        for (const [key, value] of Object.entries(data.settings)) {
          db.setSetting(key, value);
        }
      }

      // Import workouts
      if (data.workouts) {
        for (const w of data.workouts) {
          const existing = d.prepare("SELECT id FROM workouts WHERE started_at = ? AND day_key = ?").get(w.started_at, w.day_key);
          if (existing) continue; // Skip duplicates

          const result = d.prepare(
            "INSERT INTO workouts (day_key, day_name, started_at, finished_at, total_sets, completed_sets, notes) VALUES (?, ?, ?, ?, ?, ?, ?)"
          ).run(w.day_key, w.day_name, w.started_at, w.finished_at, w.total_sets, w.completed_sets, w.notes);

          if (w.sets) {
            for (const s of w.sets) {
              d.prepare(
                "INSERT INTO workout_sets (workout_id, exercise_id, exercise_name, set_number, weight, reps, completed) VALUES (?, ?, ?, ?, ?, ?, ?)"
              ).run(Number(result.lastInsertRowid), s.exercise_id, s.exercise_name, s.set_number, s.weight, s.reps, s.completed);
            }
          }
        }
      }
    });

    tx();
    res.json({ ok: true, message: "Import complete" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
