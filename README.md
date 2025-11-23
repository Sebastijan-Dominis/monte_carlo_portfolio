# 💹 Monte Carlo Portfolio

## Overview

Monte Carlo Portfolio is a web app for running Monte Carlo simulations on user-defined portfolios (stocks, ETFs, cryptocurrencies). Users specify tickers, an allocation distribution, and an initial portfolio value. Registered users can save their settings for reuse. The app uses historical price data (default: last 1000 days) to estimate portfolio trajectories over a future window (default: 100 days). This tool is educational and intended to help explore possible outcomes — it is not financial advice.

## Tech Stack

- Frontend: React (TypeScript), Vite
- Backend: FastAPI (Python)
- Database: PostgreSQL (or SQLite for local development)
- Deployment: Frontend on Vercel, Backend & DB on Render

## Quick Start (Local)

### Prerequisites

- Node.js
- Python 3.12+
- Docker (optional)

### 1. Clone

```bash
git clone https://github.com/Sebastijan-Dominis/monte_carlo_portfolio.git
cd monte_carlo_portfolio
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
# configure environment variables (see `.env.example`)
uvicorn main:app --reload
```

Optional Docker run:

```bash
docker build -t monte-carlo-backend .
docker run -p 8000:8000 monte-carlo-backend
```

### 3. Frontend

```bash
cd ../frontend
npm install
# configure environment variables (see `.env.example`)
npm run dev
```

## Environment variables

Backend (examples):

- `SECRET_KEY` — JWT secret
- `ALGORITHM` — JWT algorithm (e.g. `HS256`)
- `API_URL` — frontend URL
- `DB_URL` — database connection string (e.g. `sqlite:///./mydb` or `postgresql://user:pass@host/dbname`)
- `DEPLOYMENT_ENVIRONMENT` — `DEV` or `PRODUCTION`

Frontend (examples):

- `VITE_API_URL` — backend base URL
- `VITE_API_PORT` — backend port (default: `8000`)
- `VITE_PORT` — frontend port (default: `5173`)

Notes:

- Using SQLite (`sqlite:///./mydb`) is convenient for local development; PostgreSQL is recommended for production.

## Deployment

- Database: Render PostgreSQL (or other hosted Postgres)
- Backend: Render (Docker optional). Configure environment variables in the Render dashboard.
- Frontend: Vercel — point to the GitHub repo and set `VITE_API_URL` to your backend URL.

Health endpoints (backend):

- `/` — general health
- `/health` — checks DB connectivity

## API Reference (summary)

### Simulations

- `POST /simulations/` — run a Monte Carlo simulation.
  - Body example:
    ```json
    {
      "distribution": [0.4, 0.3, 0.3],
      "distribution_type": "exact",
      "initial_portfolio": 10000,
      "tickers": ["TSLA", "GOOGL", "META"]
    }
    ```
  - Returns: 201 and an image (graph) of simulated outcomes.

- `POST /simulations/user/{settings_id}` — run simulation using a user's saved settings.

### Auth

- `POST /auth/create-user` — create a new user (email + password). Returns 201 on success.
- `POST /auth/authorize` — obtain JWT (form data with `username` and `password`). Returns access token.
- `GET /auth/all-users` — list users (admin/internal use).
- `DELETE /auth/delete-user/{user_id}` — delete user (admin/internal use).

### Portfolio Settings

- `GET /portfolio_settings/all` — user-specific saved settings
- `POST /portfolio_settings/add` — add new settings
- `PUT /portfolio_settings/update/{settings_id}` — update settings
- `DELETE /portfolio_settings/{settings_id}` — delete settings
- `GET /portfolio_settings/` — fetch all settings (admin/internal use)

Refer to the source `backend/routers/` for full request/response details and validation rules.

## Database Schema (reference)

Example SQL used to create the core tables:

```sql
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL
);

DROP TABLE IF EXISTS portfolio_settings;

CREATE TABLE portfolio_settings (
  id SERIAL PRIMARY KEY,
  tickers JSONB NOT NULL,
  distribution_type TEXT NOT NULL CHECK (distribution_type IN ('random', 'equal', 'exact')),
  distribution JSONB NOT NULL,
  initial_portfolio DOUBLE PRECISION NOT NULL,
  owner_id INTEGER NOT NULL REFERENCES users(id)
);
```

## Screenshots

![Signup](screenshots/monte-carlo-1.png)

![Login](screenshots/monte-carlo-2.png)

![Settings](screenshots/monte-carlo-3.png)

![Adding new settings](screenshots/monte-carlo-4.png)

![Simulation starter](screenshots/monte-carlo-5.png)

![Simulation results](screenshots/monte-carlo-6.png)

![About](screenshots/monte-carlo-7.png)

## Contributing
- Improvements and bug fixes welcome. Open an issue or submit a pull request with a clear description of the change.

## License
- This repository includes a `LICENSE` file — please review it for terms of reuse.

**Contact / Author**
- Author: repository owner (see repository metadata).

