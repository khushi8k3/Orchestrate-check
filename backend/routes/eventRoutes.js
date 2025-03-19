const express = require("express");
const {
  createEvent,
  getEvents,
  rsvpToEvent,
} = require("../controllers/eventController");

const router = express.Router();

// Create an event
router.post("/", createEvent);

// Get all current events
router.get("/", getEvents);

// RSVP to an event
router.post("/:id/rsvp", rsvpToEvent);

module.exports = router;