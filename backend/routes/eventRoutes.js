const express = require("express");
const {
  createEvent,
  getEvents,
  confirmRSVP,  // Fix the imported function name
  getDetailedReport,
  getCompiledReport,
} = require("../controllers/eventController");
const router = express.Router();

// Create an event
router.post("/", createEvent);

// Get all current events
router.get("/", getEvents);

// RSVP to an event
router.post("/:id/rsvp", confirmRSVP);  // Fix the function name

// Detailed and compiled reports
router.get("/detailedReport", getDetailedReport);
router.get("/compiledReport", getCompiledReport);

module.exports = router;