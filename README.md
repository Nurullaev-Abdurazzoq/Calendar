# Calendar Application

A full-featured modern calendar application with daily, weekly, monthly, and yearly views. Built with React (frontend) and Node.js/Express (backend).

## Features

### Core Features
- ✅ Create, edit, and delete events
- ✅ Event properties: Title, Description, Date, Start/End Time, Location, Category, Color
- ✅ Recurring events (daily, weekly, monthly, yearly)
- ✅ Reminders and notifications
- ✅ Color-coded categories
- ✅ Current day highlighting
- ✅ Month/Year navigation
- ✅ Search and filter by title, category, or date

### Advanced Features
- ✅ Time zone support
- ✅ Calendar sync (iCal export)
- ✅ Offline support with local storage
- ✅ Dark mode and light mode
- ✅ Responsive UI (desktop and mobile)
- ✅ User authentication (login/register)
- ✅ User-specific calendars

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- date-fns
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- SQLite (database)
- JWT (authentication)
- bcryptjs (password hashing)

## Project Structure

```
Calendar/
├── backend/
│   ├── database/
│   │   └── db.js              # Database initialization and queries
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── errorHandler.js    # Error handling middleware
│   ├── models/
│   │   ├── User.js            # User model
│   │   └── Event.js           # Event model
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── events.js          # Event CRUD routes
│   ├── utils/
│   │   └── ical.js            # iCal export utility
│   ├── server.js              # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventModal.jsx # Event create/edit modal
│   │   │   └── EventList.jsx  # Event list component
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # Authentication context
│   │   │   └── ThemeContext.jsx # Theme context
│   │   ├── pages/
│   │   │   ├── Login.jsx      # Login page
│   │   │   ├── Register.jsx   # Registration page
│   │   │   └── Dashboard.jsx  # Main calendar dashboard
│   │   ├── services/
│   │   │   └── api.js         # Axios API client
│   │   ├── utils/
│   │   │   └── storage.js     # Local storage utility
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # React entry point
│   ├── index.html
│   └── package.json
├── package.json               # Root package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd Calendar
   ```

2. **Install all dependencies** (root, backend, and frontend)
   
   **Option A: Install all at once (recommended)**
   ```bash
   npm run install-all
   ```
   
   **Option B: Install manually**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**
   
   The backend uses a `.env` file (already created with defaults). For production, update `backend/.env`:
   ```env
   PORT=5000
   JWT_SECRET=your-secret-key-change-this-in-production
   NODE_ENV=development
   ```

## Running the Application

### Development Mode (Recommended)

Run both backend and frontend concurrently:

```bash
# From the root directory
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### Run Separately

**Backend only:**
```bash
cd backend
npm run dev
```

**Frontend only:**
```bash
cd frontend
npm run dev
```

### Production Build

**Build frontend:**
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`.

## Usage

1. **Open your browser** and navigate to `http://localhost:3000`

2. **Register a new account** or **login** if you already have one

3. **Create events:**
   - Click "New Event" button
   - Fill in event details (title, date, time, etc.)
   - Select a category and color
   - Optionally set recurring pattern and reminders
   - Click "Create Event"

4. **View events:**
   - Events are displayed on the calendar grid
   - Click on an event to edit it
   - Use navigation buttons to move between months

5. **Search and filter:**
   - Use the search bar to find events by title
   - Use the category filter to filter by category

6. **Export calendar:**
   - Click "Export" button to download events as iCal format
   - Import the `.ics` file into Google Calendar, Outlook, etc.

7. **Toggle dark mode:**
   - Click the moon/sun icon in the header

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Events
- `GET /api/events` - Get all events (with optional filters: startDate, endDate, category, search)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/export/ical` - Export events as iCal format

## Database

The application uses SQLite database. The database file (`calendar.db`) is automatically created on first run in the `backend/` directory.

### Schema

**Users table:**
- id (TEXT, PRIMARY KEY)
- username (TEXT, UNIQUE)
- email (TEXT, UNIQUE)
- password (TEXT, hashed)
- created_at (DATETIME)

**Events table:**
- id (TEXT, PRIMARY KEY)
- user_id (TEXT, FOREIGN KEY)
- title (TEXT)
- description (TEXT)
- date (TEXT)
- start_time (TEXT)
- end_time (TEXT)
- location (TEXT)
- category (TEXT)
- color (TEXT)
- is_recurring (INTEGER)
- recurrence_pattern (TEXT)
- recurrence_end_date (TEXT)
- reminder_minutes (INTEGER)
- timezone (TEXT)
- created_at (DATETIME)
- updated_at (DATETIME)

## Key Components

### Backend

- **server.js**: Main Express server setup
- **database/db.js**: SQLite database initialization and queries
- **models/User.js**: User model with authentication methods
- **models/Event.js**: Event model with CRUD operations
- **routes/auth.js**: Authentication routes (register, login)
- **routes/events.js**: Event CRUD routes
- **middleware/auth.js**: JWT token verification middleware

### Frontend

- **App.jsx**: Main app component with routing
- **pages/Dashboard.jsx**: Main calendar view with month grid
- **components/EventModal.jsx**: Modal for creating/editing events
- **context/AuthContext.jsx**: Authentication state management
- **context/ThemeContext.jsx**: Dark/light theme management
- **services/api.js**: Axios API client with authentication

## Development Notes

- The backend runs on port 5000 by default
- The frontend runs on port 3000 by default and proxies API requests to the backend
- JWT tokens expire after 7 days
- Passwords are hashed using bcryptjs
- The database is SQLite for simplicity (can be easily migrated to PostgreSQL/MySQL)

## Troubleshooting

**Port already in use:**
- Change the port in `backend/.env` (PORT) or `frontend/vite.config.js` (server.port)

**Database errors:**
- Delete `backend/calendar.db` to reset the database
- Ensure SQLite is properly installed

**CORS errors:**
- Check that the backend CORS is properly configured
- Ensure frontend proxy settings in `vite.config.js` are correct

**Authentication issues:**
- Clear browser localStorage
- Check that JWT_SECRET is set in backend/.env

## Future Enhancements

Potential features to add:
- Drag-and-drop event rescheduling
- Weekly and daily views (currently only monthly)
- Yearly view
- Email notifications
- Google Calendar sync (import/export)
- Event sharing between users
- Calendar subscriptions
- Mobile app (React Native)

## License

MIT
#   C a l e n d a r  
 #   C a l e n d a r  
 #   C a l e n d a r  
 