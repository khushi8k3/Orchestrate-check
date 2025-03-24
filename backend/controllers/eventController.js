const Event = require("../models/Events");

// Fetch all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events", error });
  }
};

// Fetch event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch event", error });
  }
};

// Add a new event
const addEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Failed to add event", error });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  addEvent
};
