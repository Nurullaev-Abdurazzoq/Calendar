import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

/**
 * Initialize SQLite database and create tables
 */
export function initDatabase() {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, '..', 'calendar.db');
    
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
      createTables().then(resolve).catch(reject);
    });
  });
}

/**
 * Create database tables if they don't exist
 */
function createTables() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
          return;
        }
      });

      // Events table
      db.run(`
        CREATE TABLE IF NOT EXISTS events (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          date TEXT NOT NULL,
          start_time TEXT NOT NULL,
          end_time TEXT NOT NULL,
          location TEXT,
          category TEXT NOT NULL DEFAULT 'personal',
          color TEXT NOT NULL DEFAULT '#3b82f6',
          is_recurring INTEGER DEFAULT 0,
          recurrence_pattern TEXT,
          recurrence_end_date TEXT,
          reminder_minutes INTEGER,
          timezone TEXT DEFAULT 'UTC',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.error('Error creating events table:', err);
          reject(err);
          return;
        }
        console.log('Database tables created successfully');
        resolve();
      });

      // Create indexes for better query performance
      db.run(`CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_events_date ON events(date)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_events_user_date ON events(user_id, date)`);
    });
  });
}

/**
 * Get database instance
 */
export function getDb() {
  return db;
}

/**
 * Promisified database methods
 */
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
