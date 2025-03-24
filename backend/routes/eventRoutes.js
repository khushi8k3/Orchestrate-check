const express = require("express");
const router = express.Router();
const { getAllEvents, getEventById, addEvent } = require("../controllers/eventController");

// Route to get all events
router.get("/events", getAllEvents);

// Route to get a specific event by ID
router.get("/events/:id", getEventById);

// Route to add a new event
router.post("/events", addEvent);

module.exports = router;
