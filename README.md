# Movie App

This repository contains the Movie App frontend and API, along with a separate
Node.js learning project.

## Frontend

```powershell
cd movie-app-frontend-react-ts-main-main/app
npm ci
npm run dev
```

## Movie App API

```powershell
cd movie-app-express-nodejs-ps-main-main
npm ci
Copy-Item .env_sample .env
```

Create a PostgreSQL database named `movie_app`, then set the PostgreSQL values
and a unique `JWT_SECRET` in `.env`. The frontend defaults to the API at
`http://localhost:5678`; set `VITE_API_BASE_URL` in the frontend environment if
you use a different address. Run the initial migrations and start the API:

```powershell
npx sequelize-cli db:migrate
npm start
```

## Node.js learning project

```powershell
cd nodejs-learn
npm ci
Copy-Item config/config.example.json config/config.json
# Configure config/config.json and the TWILIO_ACCOUNT_SID,
# TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables.
node app.js
```
