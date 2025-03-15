const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const Employee = require('../models/employee');

// Get all employees for selection
router.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find({}, 'email name');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees' });
    }
});

// Create a new event
router.post('/events', async (req, res) => {
  try {
      const { eventName, eventDateTime, budget, eventType, ticketPrice, maxPeopleAllowed, rsvpPeople, tasks } = req.body;
      
      if (eventType === 'Limited Entry' && (!ticketPrice || !maxPeopleAllowed)) {
          return res.status(400).json({ message: 'Ticket price and max people required for Limited Entry' });
      }

      const newEvent = new Event({ eventName, eventDateTime, budget, eventType, ticketPrice, maxPeopleAllowed, rsvpPeople, tasks });
      await newEvent.save();

      res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error creating event' });
  }
});
