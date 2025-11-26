# 💹 Monte Carlo Portfolio

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Environment variables](#environment-variables)
- [Installation](#installation)
- [API Reference (summary)](#api-reference-summary)
- [Database Schema (reference)](#database-schema-reference)
- [Screenshots](#screenshots)
- [License](#license)
- [Contributing](#contributing)
- [Author & Contact](#author--contact)

## Overview

Monte Carlo Portfolio is a web app for running Monte Carlo simulations on user-defined portfolios (stocks, ETFs, cryptocurrencies). Users specify tickers, an allocation distribution, and an initial portfolio value. Registered users can save their settings for reuse. The app uses historical price data (default: last 1000 days) to estimate portfolio trajectories over a future window (default: 100 days). This tool is educational and intended to help explore possible outcomes — it is not financial advice.

## Tech Stack

- Frontend: React (TypeScript), Vite
- Backend: FastAPI (Python)
- Database: PostgreSQL (or SQLite for local development)
- Deployment: Frontend on Vercel, Backend & DB on Render
- Docker

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

## Installation

### Prerequisites

- Node.js and Python 3.12+
 
**or**

- Docker

### Without docker:

#### 1. Clone

```bash
git clone https://github.com/Sebastijan-Dominis/monte_carlo_portfolio.git
cd monte_carlo_portfolio
```

#### 2. Backend

##### Create and activate a virtual environment

If using Anaconda:

```bash
cd backend
conda create -n monte-carlo-portfolio python=3.12
conda activate monte-carlo-portfolio
```

##### Install the requirements

```bash
pip install -r requirements.txt
```

##### Configure the environment variables (see `.env.example`)

##### Launch the backend server

```bash
uvicorn main:app --reload
```

#### 3. Frontend

##### Launch a new terminal

##### Navigate to frontend
```bash
cd frontend
```

##### Install the dependencies
```bash
npm install
```

##### Configure the environment variables (see `.env.example`)

##### Run the frontend server
```bash
npm run dev
```

##### Use the app
> typically `http://localhost:5173/`.

### With docker:

#### Configure the environment variables (see `.env.example`)

- Do this for both backend and frontend

#### Build the docker image

```bash
docker-compose build --no-cache
```

#### Run the docker container

```bash
docker compose up
```

#### Use the app
> typically `http://localhost:5173/`.

## API Reference (summary)

### Health:

- `/` — general health
- `/health` — checks DB connectivity

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

### Signup

![Signup](screenshots/monte-carlo-1.png)

### Login

![Login](screenshots/monte-carlo-2.png)

### Settings

![Settings](screenshots/monte-carlo-3.png)

### Adding new settings

![Adding new settings](screenshots/monte-carlo-4.png)

### Simulation starter

![Simulation starter](screenshots/monte-carlo-5.png)

### Simulation results

![Simulation results](screenshots/monte-carlo-6.png)

### About

![About](screenshots/monte-carlo-7.png)

## License
- This repository includes a `LICENSE` file — please review it for terms of reuse.

## Contributing
- Improvements and bug fixes welcome. Open an issue or submit a pull request with a clear description of the change.

## Author & Contact
- Author: Sebastijan Dominis
- Contact: sebastijan.dominis99@gmail.com
