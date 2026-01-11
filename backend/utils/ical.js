import ical from 'ical-generator';

/**
 * Create iCal format string from events
 */
export function createICal(events) {
  const calendar = ical({ name: 'My Calendar' });

  events.forEach(event => {
    const startDate = new Date(`${event.date}T${event.startTime}`);
    const endDate = new Date(`${event.date}T${event.endTime}`);

    calendar.createEvent({
      start: startDate,
      end: endDate,
      summary: event.title,
      description: event.description,
      location: event.location,
      url: '',
      organizer: {
        name: 'Calendar App',
        email: 'noreply@calendar.app'
      }
    });
  });

  return calendar.toString();
}
