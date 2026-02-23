const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "db", "workouts.db");

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    init();
  }
  return db;
}

function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_key TEXT NOT NULL,
      day_name TEXT NOT NULL,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      finished_at TEXT,
      total_sets INTEGER DEFAULT 0,
      completed_sets INTEGER DEFAULT 0,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS workout_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
      exercise_id TEXT NOT NULL,
      exercise_name TEXT NOT NULL,
      set_number INTEGER NOT NULL,
      weight REAL,
      reps TEXT,
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS exercise_prs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id TEXT NOT NULL,
      exercise_name TEXT NOT NULL,
      weight REAL NOT NULL,
      reps TEXT NOT NULL,
      achieved_at TEXT DEFAULT (datetime('now')),
      UNIQUE(exercise_id, weight, reps)
    );

    CREATE INDEX IF NOT EXISTS idx_workout_sets_workout ON workout_sets(workout_id);
    CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise ON workout_sets(exercise_id);
    CREATE INDEX IF NOT EXISTS idx_workouts_day ON workouts(day_key);
    CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(started_at);
    CREATE INDEX IF NOT EXISTS idx_exercise_prs_exercise ON exercise_prs(exercise_id);
  `);

  // Seed default settings if empty
  const count = db.prepare("SELECT COUNT(*) as c FROM settings").get();
  if (count.c === 0) {
    const insert = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
    insert.run("current_week", "0");
  }
}

// ─── Settings ───
function getSetting(key) {
  const row = getDb().prepare("SELECT value FROM settings WHERE key = ?").get(key);
  return row ? row.value : null;
}

function setSetting(key, value) {
  getDb().prepare(
    "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = datetime('now')"
  ).run(key, String(value), String(value));
}

function getAllSettings() {
  const rows = getDb().prepare("SELECT key, value FROM settings").all();
  const obj = {};
  rows.forEach(r => obj[r.key] = r.value);
  return obj;
}

// ─── Workouts ───
function startWorkout(dayKey, dayName) {
  const result = getDb().prepare(
    "INSERT INTO workouts (day_key, day_name) VALUES (?, ?)"
  ).run(dayKey, dayName);
  return result.lastInsertRowid;
}

function finishWorkout(id, completedSets, totalSets, notes) {
  getDb().prepare(
    "UPDATE workouts SET finished_at = datetime('now'), completed_sets = ?, total_sets = ?, notes = ? WHERE id = ?"
  ).run(completedSets, totalSets, notes || null, id);
}

function getWorkoutHistory(limit = 50, offset = 0) {
  return getDb().prepare(
    "SELECT * FROM workouts ORDER BY started_at DESC LIMIT ? OFFSET ?"
  ).all(limit, offset);
}

function getWorkout(id) {
  const workout = getDb().prepare("SELECT * FROM workouts WHERE id = ?").get(id);
  if (!workout) return null;
  workout.sets = getDb().prepare(
    "SELECT * FROM workout_sets WHERE workout_id = ? ORDER BY exercise_id, set_number"
  ).all(id);
  return workout;
}

function deleteWorkout(id) {
  getDb().prepare("DELETE FROM workouts WHERE id = ?").run(id);
}

// ─── Sets ───
function saveSet(workoutId, exerciseId, exerciseName, setNumber, weight, reps, completed) {
  return getDb().prepare(`
    INSERT INTO workout_sets (workout_id, exercise_id, exercise_name, set_number, weight, reps, completed)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT DO NOTHING
  `).run(workoutId, exerciseId, exerciseName, setNumber, weight || null, reps || null, completed ? 1 : 0);
}

function saveSets(workoutId, sets) {
  const stmt = getDb().prepare(`
    INSERT OR REPLACE INTO workout_sets (workout_id, exercise_id, exercise_name, set_number, weight, reps, completed)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = getDb().transaction((items) => {
    // Clear existing sets for this workout first
    getDb().prepare("DELETE FROM workout_sets WHERE workout_id = ?").run(workoutId);
    for (const s of items) {
      stmt.run(workoutId, s.exercise_id, s.exercise_name, s.set_number, s.weight || null, s.reps || null, s.completed ? 1 : 0);
    }
  });

  tx(sets);
}

// ─── PRs ───
function checkAndSavePR(exerciseId, exerciseName, weight, reps) {
  if (!weight || weight <= 0) return null;
  try {
    getDb().prepare(
      "INSERT OR IGNORE INTO exercise_prs (exercise_id, exercise_name, weight, reps) VALUES (?, ?, ?, ?)"
    ).run(exerciseId, exerciseName, weight, reps || "");
    return true;
  } catch {
    return false;
  }
}

function getExercisePRs(exerciseId) {
  return getDb().prepare(
    "SELECT * FROM exercise_prs WHERE exercise_id = ? ORDER BY weight DESC, achieved_at DESC"
  ).all(exerciseId);
}

function getAllPRs() {
  // Best weight per exercise
  return getDb().prepare(`
    SELECT exercise_id, exercise_name, MAX(weight) as best_weight, reps, achieved_at
    FROM exercise_prs
    GROUP BY exercise_id
    ORDER BY exercise_name
  `).all();
}

// ─── Stats ───
function getExerciseHistory(exerciseId, limit = 20) {
  return getDb().prepare(`
    SELECT ws.*, w.started_at as workout_date, w.day_name
    FROM workout_sets ws
    JOIN workouts w ON w.id = ws.workout_id
    WHERE ws.exercise_id = ? AND ws.completed = 1 AND ws.weight IS NOT NULL
    ORDER BY w.started_at DESC
    LIMIT ?
  `).all(exerciseId, limit);
}

function getWeeklyVolume(weeks = 8) {
  return getDb().prepare(`
    SELECT
      strftime('%Y-W%W', w.started_at) as week,
      COUNT(DISTINCT w.id) as sessions,
      SUM(CASE WHEN ws.completed = 1 THEN 1 ELSE 0 END) as total_sets,
      SUM(CASE WHEN ws.completed = 1 AND ws.weight IS NOT NULL THEN ws.weight * CAST(ws.reps AS REAL) ELSE 0 END) as total_volume
    FROM workouts w
    LEFT JOIN workout_sets ws ON ws.workout_id = w.id
    WHERE w.started_at >= datetime('now', '-' || ? || ' days')
    GROUP BY week
    ORDER BY week DESC
  `).all(weeks * 7);
}

module.exports = {
  getDb,
  getSetting, setSetting, getAllSettings,
  startWorkout, finishWorkout, getWorkoutHistory, getWorkout, deleteWorkout,
  saveSet, saveSets,
  checkAndSavePR, getExercisePRs, getAllPRs,
  getExerciseHistory, getWeeklyVolume,
};
