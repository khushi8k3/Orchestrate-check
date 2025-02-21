const express = require('express');
const Event = require('../models/Event');

const router = express.Router();

// Get all current events
router.get('/events', async (req, res) => {
  try {
    const currentDate = new Date();
    const events = await Event.find({ date: { $gte: currentDate } });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// RSVP to an event
router.post('/events/:id/rsvp', async (req, res) => {
  const { employeeName } = req.body;
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.rsvpList.includes(employeeName)) {
      return res.status(400).json({ message: 'Already RSVP’d' });
    }

    if (event.availableSpots <= 0) {
      return res.status(400).json({ message: 'No spots available' });
    }

    event.rsvpList.push(employeeName);
    event.availableSpots -= 1;
    await event.save();

    res.status(200).json({ message: 'RSVP successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
