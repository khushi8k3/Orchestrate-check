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
router.post("/events/:id/rsvp", async (req, res) => {
  const { employeeName } = req.body;
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if user is already in attendees list
    if (event.attendees.includes(employeeName)) {
      return res.status(400).json({ message: "Already RSVP’d" });
    }

    // Check if event has available spots
    if (event.availableSlots !== null && event.availableSlots== 0) {
      return res.status(400).json({ message: "No slots available" });
    }

    // Add employee to attendees list and decrease available spots
    event.attendees.push(employeeName);
    if (event.availableSlots !== null) {
      event.availableSlots -= 1; // Decrease available spots
    }

    await event.save();

    res.status(200).json({ message: "RSVP successful", availableSlots: event.availableSlots });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});


module.exports = router;
