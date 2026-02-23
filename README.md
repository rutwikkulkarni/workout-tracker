# Road to 100kg - Workout Tracker

A self-hosted workout tracker built for the Road to 100kg Bench Press programme.

## Stack
- **Backend**: Node.js + Express
- **Database**: SQLite via better-sqlite3 (WAL mode for performance)
- **Frontend**: React 18 (CDN, no build step)
- **Container**: Docker with persistent volume

## Quick Start

```bash
docker compose up -d
```

App runs on `http://localhost:3000`

## Features
- Full programme with all 4 training days
- Rest timer with auto-start on set completion
- Weight and rep logging per set
- Accessory progression guide with method badges
- 25-week bench/squat progression table
- Automatic PR tracking
- Workout history with SQLite persistence
- Data export/import (JSON backup)
- PWA support (add to home screen on mobile)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get all settings |
| PUT | `/api/settings/:key` | Update a setting |
| GET | `/api/workouts` | Get workout history |
| POST | `/api/workouts` | Start a new workout |
| GET | `/api/workouts/:id` | Get workout with sets |
| PUT | `/api/workouts/:id/finish` | Finish a workout |
| DELETE | `/api/workouts/:id` | Delete a workout |
| POST | `/api/workouts/:id/sets` | Save sets for workout |
| GET | `/api/prs` | Get all personal records |
| GET | `/api/prs/:exerciseId` | Get PRs for exercise |
| GET | `/api/stats/exercise/:id` | Exercise history |
| GET | `/api/stats/volume` | Weekly volume stats |
| GET | `/api/export` | Export all data as JSON |
| POST | `/api/import` | Import data from JSON |

## Data Persistence

SQLite database is stored in a Docker volume (`workout-data`). 
The database persists across container restarts and rebuilds.

To backup manually:
```bash
docker cp road-to-100kg:/app/db/workouts.db ./backup.db
```

Or use the built-in export:
```bash
curl http://localhost:3000/api/export > backup.json
```

## Development

```bash
npm install
npm run dev
```

Runs with `--watch` for auto-restart on file changes.

## Mobile Setup

1. Open `http://your-server:3000` on your phone
2. Tap "Add to Home Screen" (iOS Safari / Android Chrome)
3. App runs fullscreen like a native app
