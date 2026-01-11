📅 Calendar Application

A modern full-stack calendar application built with React (frontend) and Node.js / Express (backend). It allows users to manage events, set reminders, and organize schedules with a clean, responsive UI.

✨ Features

Create, edit, and delete events

Event details: title, description, date, time, location, category, color

Recurring events (daily, weekly, monthly, yearly)

Reminders and notifications

Search and filter events

Dark / Light mode

User authentication (login & register)

User-specific calendars

iCal export (Google Calendar, Outlook, etc.)

Responsive design (desktop & mobile)

🛠 Tech Stack
Frontend

React 18

Vite

Tailwind CSS

React Router

Axios

date-fns

Backend

Node.js

Express.js

SQLite

JWT Authentication

bcryptjs

📂 Project Structure
Calendar/
├── backend/    # Express API, SQLite DB, Auth, Events
├── frontend/   # React UI
├── package.json
└── README.md

⚙️ Setup
Requirements

Node.js (v16+)

npm

Install dependencies
npm run install-all


Or manually:

cd backend && npm install
cd ../frontend && npm install

▶️ Run the App
Development (recommended)
npm run dev


Frontend: http://localhost:3000

Backend: http://localhost:5000

🔐 API Overview

Auth

POST /api/auth/register

POST /api/auth/login

Events

GET /api/events

POST /api/events

PUT /api/events/:id

DELETE /api/events/:id

GET /api/events/export/ical

🗄 Database

SQLite (calendar.db)

Auto-created on first run

Tables: users, events

🚀 Future Improvements

Daily / Weekly / Yearly views

Drag & drop events

Email notifications

Google Calendar sync

Event sharing

Mobile app (React Native)

📜 License

MIT
