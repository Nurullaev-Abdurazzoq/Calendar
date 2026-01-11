import { v4 as uuidv4 } from 'uuid';
import { dbGet, dbAll, dbRun } from '../database/db.js';

/**
 * Event model
 */
export class Event {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.title = data.title;
    this.description = data.description || '';
    this.date = data.date;
    this.startTime = data.start_time;
    this.endTime = data.end_time;
    this.location = data.location || '';
    this.category = data.category || 'personal';
    this.color = data.color || '#3b82f6';
    this.isRecurring = data.is_recurring === 1;
    this.recurrencePattern = data.recurrence_pattern || null;
    this.recurrenceEndDate = data.recurrence_end_date || null;
    this.reminderMinutes = data.reminder_minutes || null;
    this.timezone = data.timezone || 'UTC';
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  /**
   * Create a new event
   */
  static async create(eventData) {
    const eventId = uuidv4();
    const isRecurring = eventData.isRecurring ? 1 : 0;

    await dbRun(
      `INSERT INTO events (
        id, user_id, title, description, date, start_time, end_time,
        location, category, color, is_recurring, recurrence_pattern,
        recurrence_end_date, reminder_minutes, timezone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        eventId,
        eventData.userId,
        eventData.title,
        eventData.description || '',
        eventData.date,
        eventData.startTime,
        eventData.endTime,
        eventData.location || '',
        eventData.category || 'personal',
        eventData.color || '#3b82f6',
        isRecurring,
        eventData.recurrencePattern || null,
        eventData.recurrenceEndDate || null,
        eventData.reminderMinutes || null,
        eventData.timezone || 'UTC'
      ]
    );

    return Event.findById(eventId);
  }

  /**
   * Find event by ID
   */
  static async findById(id) {
    const event = await dbGet('SELECT * FROM events WHERE id = ?', [id]);
    return event ? new Event(event) : null;
  }

  /**
   * Find events by user ID
   */
  static async findByUserId(userId, filters = {}) {
    let query = 'SELECT * FROM events WHERE user_id = ?';
    const params = [userId];

    if (filters.startDate) {
      query += ' AND date >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND date <= ?';
      params.push(filters.endDate);
    }

    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY date, start_time';

    const events = await dbAll(query, params);
    return events.map(event => new Event(event));
  }

  /**
   * Update event
   */
  static async update(id, eventData) {
    const updates = [];
    const params = [];

    const fields = {
      title: 'title',
      description: 'description',
      date: 'date',
      startTime: 'start_time',
      endTime: 'end_time',
      location: 'location',
      category: 'category',
      color: 'color',
      isRecurring: 'is_recurring',
      recurrencePattern: 'recurrence_pattern',
      recurrenceEndDate: 'recurrence_end_date',
      reminderMinutes: 'reminder_minutes',
      timezone: 'timezone'
    };

    for (const [key, dbField] of Object.entries(fields)) {
      if (eventData[key] !== undefined) {
        updates.push(`${dbField} = ?`);
        params.push(key === 'isRecurring' ? (eventData[key] ? 1 : 0) : eventData[key]);
      }
    }

    if (updates.length === 0) {
      return Event.findById(id);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await dbRun(
      `UPDATE events SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    return Event.findById(id);
  }

  /**
   * Delete event
   */
  static async delete(id) {
    await dbRun('DELETE FROM events WHERE id = ?', [id]);
    return true;
  }

  /**
   * Check if event belongs to user
   */
  static async belongsToUser(eventId, userId) {
    const event = await Event.findById(eventId);
    return event && event.userId === userId;
  }

  /**
   * Convert event to JSON
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      location: this.location,
      category: this.category,
      color: this.color,
      isRecurring: this.isRecurring,
      recurrencePattern: this.recurrencePattern,
      recurrenceEndDate: this.recurrenceEndDate,
      reminderMinutes: this.reminderMinutes,
      timezone: this.timezone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
