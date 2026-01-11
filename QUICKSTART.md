# Quick Start Guide

## 🚀 Quick Setup (3 Steps)

### Step 1: Install Dependencies

```bash
npm run install-all
```

This installs dependencies for root, backend, and frontend automatically.

### Step 2: Start the Application

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 3000) servers.

### Step 3: Open in Browser

Navigate to: **http://localhost:3000**

---

## 📝 First Time Setup

1. **Register a new account** on the login page
2. **Create your first event** by clicking "New Event"
3. **Explore the calendar** - navigate months, search events, toggle dark mode

---

## 🔧 Manual Setup (Alternative)

If the automated scripts don't work, install manually:

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install

# Start backend (in backend directory)
npm run dev

# Start frontend (in new terminal, frontend directory)
npm run dev
```

---

## ✅ Verify Installation

- Backend should show: `Server running on port 5000`
- Frontend should show: `Local: http://localhost:3000`
- Database file `backend/calendar.db` should be created automatically

---

## 🐛 Troubleshooting

**Port already in use?**
- Change ports in `backend/.env` (PORT) or `frontend/vite.config.js` (server.port)

**Module not found errors?**
- Make sure you ran `npm install` in all directories (root, backend, frontend)

**Database errors?**
- Delete `backend/calendar.db` to reset the database

**CORS errors?**
- Ensure backend is running on port 5000
- Check `frontend/vite.config.js` proxy settings

---

For detailed documentation, see [README.md](README.md)
