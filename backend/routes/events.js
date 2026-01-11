import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { Event } from '../models/Event.js';
import { createICal } from '../utils/ical.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * Get all events for the authenticated user
 * GET /api/events
 */
router.get(
  '/',
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('category').optional().trim(),
    query('search').optional().trim()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        category: req.query.category,
        search: req.query.search
      };

      const events = await Event.findByUserId(req.user.id, filters);
      res.json(events.map(event => event.toJSON()));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get single event by ID
 * GET /api/events/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(event.toJSON());
  } catch (error) {
    next(error);
  }
});

/**
 * Create new event
 * POST /api/events
 */
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time is required (HH:MM)'),
    body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time is required (HH:MM)'),
    body('category').optional().trim(),
    body('color').optional().trim(),
    body('isRecurring').optional().isBoolean(),
    body('recurrencePattern').optional().trim(),
    body('timezone').optional().trim()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const eventData = {
        userId: req.user.id,
        title: req.body.title,
        description: req.body.description || '',
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        location: req.body.location || '',
        category: req.body.category || 'personal',
        color: req.body.color || '#3b82f6',
        isRecurring: req.body.isRecurring || false,
        recurrencePattern: req.body.recurrencePattern || null,
        recurrenceEndDate: req.body.recurrenceEndDate || null,
        reminderMinutes: req.body.reminderMinutes || null,
        timezone: req.body.timezone || 'UTC'
      };

      const event = await Event.create(eventData);
      res.status(201).json(event.toJSON());
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Update event
 * PUT /api/events/:id
 */
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty(),
    body('date').optional().isISO8601(),
    body('startTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('endTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('category').optional().trim(),
    body('color').optional().trim()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const eventId = req.params.id;

      // Check if event exists and belongs to user
      const belongsToUser = await Event.belongsToUser(eventId, req.user.id);
      if (!belongsToUser) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const eventData = {};
      const allowedFields = [
        'title', 'description', 'date', 'startTime', 'endTime',
        'location', 'category', 'color', 'isRecurring',
        'recurrencePattern', 'recurrenceEndDate', 'reminderMinutes', 'timezone'
      ];

      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          eventData[field] = req.body[field];
        }
      });

      const event = await Event.update(eventId, eventData);
      res.json(event.toJSON());
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Delete event
 * DELETE /api/events/:id
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const eventId = req.params.id;

    // Check if event exists and belongs to user
    const belongsToUser = await Event.belongsToUser(eventId, req.user.id);
    if (!belongsToUser) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await Event.delete(eventId);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * Export events as iCal
 * GET /api/events/export/ical
 */
router.get('/export/ical', async (req, res, next) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    const events = await Event.findByUserId(req.user.id, filters);
    const ical = createICal(events.map(e => e.toJSON()));

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename="calendar.ics"');
    res.send(ical);
  } catch (error) {
    next(error);
  }
});

export default router;
