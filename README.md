# 💹 Monte Carlo Portfolio 💹

## 🚀 Overview

This web application allows users to run the Monte Carlo simulation on a portfolio of choice. They can choose which stocks, ETFs, and/or cryptocurrencies to include by adding their respective tickers, which can be found on Yahoo finance. Users also determine the distribution of money within a given portfolio, as well as the amount of money itself. Registered users can save settings for running the Monte Carlo simulation, so that they don't have to re-enter them each time they want to run the simulation again. This application is aimed towards anyone thinking about, or having invested money into stocks, ETFs, and/or cryptocurrencies. It helps these individuals estimate how they can expect their portfolio to change over the next 100 days, based on the past 1000 days. While predicting the markets is ultimately impossible, tools like this can aid investors in deciding what to do with their money.

## 🧱 Tech Stack

- **Frontend:** React (TypeScript), Vite
- **Backend:** FastAPI
- **Database:** PostgreSQL
- **Deployment:**
  - Frontend: Vercel
  - Backend: Render
  - DB: Render PostgreSQL

## 🛠️ Local Development Setup

### Prerequisites

- Node.js
- Python 3.12+
- Docker (optional)
- sqlite (installed with requirements) or PostgreSQL (local or Docker)

### 1. Clone the repository

```bash
git clone https://github.com/Sebastijan-Dominis/monte_carlo_portfolio.git
cd monte_carlo_portfolio
```

### 2. Set up backend

```bash
cd backend
pip install -r requirements.txt
```

- define .env variables, as described in .env.example
- optionally:

```bash
docker build -t your-backend .
docker run -p 8000:8000 your-backend
```

### 3. Set up frontend

```bash
cd ..
cd frontend
npm install
```

- define .env variables, as described in .env.example

```bash
npm run dev
```

## Environment variables

### backend

SECRET_KEY=your-secret-key-for-jwt
ALGORITHM=algorithm-of-your-choice-for-jwt

option 1:
DB_URL=sqlite:///./mydb
DEPLOYMENT_ENVIRONMENT=DEV

option 2:
DB_URL=postgresql://user:password@localhost/mydb
DEPLOYMENT_ENVIRONMENT=PRODUCTION

API_URL=url-to-frontend

- going with the sqlite option will automatically create an sqlite database within your backend folder
- if opting for postgresql, make sure to create an actual database locally or remotely, run it, and use a valid url to connect to it (should be defined in the DB_URL environment variable)
- using sqlite is recommended for development and local use (easy to use), while postgresql is recommended for deployment

### frontend

VITE_API_URL=url-to-backend
VITE_API_PORT=8000  
VITE_PORT=5173

## Deployment

Database (Render PostgreSQL)

- Hosted PostgreSQL instance

Backend (Render)

- Dockerized (optional) FastAPI deployed on Render
- Add environment variables via Render dashboard
- Use the appropriate url from database deployment to connect backend to the database by setting the DB_URL environment variable to that value
- General health check route: /
- Health check route to check the connection to the database: /health

Frontend (Vercel)

- Deployed to Vercel from GitHub repository
- Set environment variables - most importantly, set VITE_API_URL to the appropriate value that connects frontend to the backend on Render

- In Backend on Render, change the API_URL variable to enable connection to the frontend

## API Documentation

### Simulations

#### Run Monte Carlo

- `/simulations/`
- no parameters
- example of a request body:
  {
  "distribution": [
  0.4,
  0.3,
  0.3
  ],
  "distribution_type": "exact",
  "initial_portfolio": 10000,
  "tickers": [
  "TSLA",
  "GOOGL",
  "META"
  ]
  }

This endpoint runs the MC simulation and returns an image (a graph).

Successful response: 201

Most common error:

- 422: Validation error
- triggered in frontend in the "Sim" section

#### Run Monte Carlo User

- `/simulations/user/{settings_id}`

- parameters:
  settings_id: integer, required

This endpoint runs the MC simulation with settings predefined by the logged-in user and returns an image (a graph).

Successful response: 201

Most common errors:

- 422: Validation error
- 404: Settings not found.

### auth

#### Create User

- `/auth/create-user`

- no parameters

- example of a request body:
  {
  "email": "john_doe@gmail.com",
  "password": "johndoe123"
  }

This endpoint creates a new user, and adds their email and hashed password (using argon2 for hashing) to the database, assuming that the user with this email does not already exist. It returns {"message": "User successfully created"}.

Successful response: 201

Most common errors:

- 422: Validation error
- 409: User with email {email} already exists.
- 500: User creation failed: {error}

#### Authorize User

- `/auth/authorize`

- no parameters

Request body expects form data. Email should be used as "username".

This endpoint is used for logging in the user and assigning them a JWT, which expires in 60 minutes of no action. It returns {"access_token": token, "token_type": "bearer"}.

Successful response: 200

Most common errors:

- 422: Validation error

#### Read Users

- `/auth/all-users`

- no parameters

This endpoint is used for reading all of the users, and is not meant to be called from frontend. It returns a list of all of the registered users.

Successful response: 200

#### Delete User

- `/auth/delete-user/{user_id}`

- parameters:
  user_id: integer

This endpoint is used for deleting a user by their id, and is not meant to be called from frontend. It returns {"message": "User with id {user_id} successfully deleted."}.

Successful response: 200

Most common errors:

- 422: Validation error
- 404: User not found.

### portfolio_settings

#### Get All Settings Of User

- `/portfolio_settings/all`

- no parameters

This endpoint is used to fetch all of the logged-in user's saved portfolio settings from the database, and displaying them in the appropriate section of the frontend. It returns a list of portfolio settings.

Successful response: 200

Most common errors:

- 401: Authorization Failed.

#### Add Portfolio Settings

- `/portfolio_settings/add`

- no parameters

- example of a request body:
  {
  "distribution": [
  0.4,
  0.3,
  0.3
  ],
  "distribution_type": "exact",
  "initial_portfolio": 10000,
  "tickers": [
  "TSLA",
  "GOOGL",
  "META"
  ]
  }

This endpoint is used for creating a new instance of portfolio settings that belong to a specific logged-in user. It returns {"message": "Success"}.

Successful response: 201

Most common errors:

- 422: Validation error
- 401: Authorization Failed.
- 403: Only {MAX_SETTINGS_PER_USER} settings are allowed per user.

#### Update Settings

- `/portfolio_settings/update/{settings_id}`

- parameters:
  settings_id: integer

- example of a request body:
  {
  "distribution": [
  0.4,
  0.3,
  0.3
  ],
  "distribution_type": "exact",
  "initial_portfolio": 10000,
  "tickers": [
  "TSLA",
  "GOOGL",
  "META"
  ]
  }

This endpoint is used for updating an instance of portfolio settings that belong to a logged-in user. It returns {"message": "Success"}.

Successful response: 204

Most common errors:

- 422: Validation Error
- 401: Authorization Failed.
- 404: Settings not found.

#### Delete Settings

- `/portfolio_settings/{settings_id}`

- parameters:
  settings_id: integer

This endpoint is used for deleting an instance of portfolio settings that belong to a logged-in user. It returns {"message": "Success"}.

Successful response: 204

Most common errors:

- 422: Validation Error
- 404: User not found.
- 404: Portfolio settings not found.

#### Get All Settings

- `/portfolio_settings/`

- no parameters

This endpoint is used for fetching all of the portfolio settings saved by all of the users in the database, and is not meant to be called from the frontend. It returns a list of portfolio settings.

Successful response: 200

### default

#### Health Check

- `/`

- no parameters

This endpoint is used for checking whether the backend is working properly, and is not meant to be called from the frontend. It returns {"Healthy": 200}.

Successful response: 200

#### Db Health Check

- `/health`

- no parameters

This endpoint is used for checking whether the backend is able to establish proper communication with the database, and is not meant to be called from the frontend. It returns {"status": "ok"}, or {"status": "db_error", "detail": error} (for any error).

Successful response: 200

## Database Schema

- if one chooses to manually create the PostgreSQL database, it should be done like so:

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
