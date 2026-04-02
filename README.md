# Esports Backend API

## Setup & Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to create an `.env` file
   - Update the environment variables with your values
   - The API key is already set: `tAHcwSeouKpcgo1ku4FX49IzGXcCsmSxY76jufLp`

3. **Start the server:**
   ```bash
   npm start        # Production
   npm run dev      # Development with auto-reload
   ```

The backend will run on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/api/health`
- No authentication required

### Live Scores
- **GET** `/api/live-scores`
- Requires: `x-api-key` header
- Returns current game scores

### Player Data
- **POST** `/api/player-data`
- Requires: `x-api-key` header
- Body: Player data object

## Frontend Configuration

The frontend is already configured to:
- Connect to `http://localhost:5000`
- Send API key in headers automatically
- Use environment variables from `.env.local`

## CORS Configuration

CORS is enabled for `http://localhost:5173` (frontend dev server).
Update `FRONTEND_URL` in `.env` to allow other origins.
