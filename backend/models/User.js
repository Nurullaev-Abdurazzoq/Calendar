import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { dbGet, dbRun } from '../database/db.js';

/**
 * User model
 */
export class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.createdAt = data.created_at;
  }

  /**
   * Create a new user
   */
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userId = uuidv4();

    await dbRun(
      'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)',
      [userId, userData.username, userData.email, hashedPassword]
    );

    return User.findById(userId);
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [id]);
    return user ? new User(user) : null;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    return user ? new User(user) : null;
  }

  /**
   * Find user by username
   */
  static async findByUsername(username) {
    const user = await dbGet('SELECT * FROM users WHERE username = ?', [username]);
    return user ? new User(user) : null;
  }

  /**
   * Verify password
   */
  async verifyPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  /**
   * Convert user to JSON (excluding password)
   */
  toJSON() {
    const { password, ...user } = this;
    return user;
  }
}
